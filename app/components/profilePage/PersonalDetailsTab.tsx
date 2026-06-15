"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useUpdateUser, useUserOwnData } from "@/providers/Users";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import {
  KeyIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const ApplicationUserUpdateSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Required"),
  phoneNumber: Yup.string()
    .min(8, "Phone number is too short")
    .max(50, "Phone number is too long"),
  newPassword: Yup.string()
    .min(6, "The password must be a string with at least 6 characters.")
    .max(50, "The password must be a string of up to 50 characters."),
});

interface FormValues {
  displayName: string;
  phoneNumber: string;
  newPassword: string;
}

const inputClass = (hasError: boolean) =>
  `h-10 w-full rounded-xl border bg-white px-3 text-sm text-[#2D3648] outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
      : "border-slate-200 focus:border-[#1F5FD6] focus:ring-[#1F5FD6]/15"
  }`;

export const PersonalDetailsTab = () => {
  const { authToken } = useAuthContext();
  const [personalDetails, setPersonalDetails] = useState<FormValues>({
    displayName: "",
    phoneNumber: "",
    newPassword: "",
  });

  const router = useRouter();

  const userData = useUserOwnData({ authToken });
  const updateUser = useUpdateUser({ authToken });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: personalDetails,
    validationSchema: ApplicationUserUpdateSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await updateUser.mutateAsync(values);
      toast.success("Updated successfully");

      if (values.newPassword) {
        await signOut(firebaseClientAuth);
        router.push("/signin");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again",
      );
    }
  };

  useEffect(() => {
    if (userData.isSuccess && userData.data) {
      setPersonalDetails({
        displayName: userData.data?.displayName || "",
        phoneNumber: userData.data?.phoneNumber || "",
        newPassword: "",
      });
    }
  }, [userData.data, userData.isSuccess]);

  const displayNameError = Boolean(
    formik.errors.displayName && formik.touched.displayName,
  );
  const phoneError = Boolean(
    formik.errors.phoneNumber && formik.touched.phoneNumber,
  );
  const passwordError = Boolean(
    formik.errors.newPassword && formik.touched.newPassword,
  );

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
            <UserCircleIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#2D3648]">Profile details</h3>
            <p className="mt-1 text-sm leading-6 text-[#717D96]">
              These details are used for your profile, enquiries, and listing
              contact information.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:px-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2D3648]">
            <UserCircleIcon className="h-4 w-4 text-[#1F5FD6]" />
            Display name
          </span>
          <input
            type="text"
            value={formik.values.displayName}
            onChange={(e) =>
              formik.setFieldValue("displayName", e.target.value, true)
            }
            onBlur={formik.handleBlur}
            name="displayName"
            className={inputClass(displayNameError)}
          />
          {displayNameError && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.displayName}
            </p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2D3648]">
            <PhoneIcon className="h-4 w-4 text-[#1F5FD6]" />
            Phone number
          </span>
          <input
            type="text"
            value={formik.values.phoneNumber}
            onChange={(e) =>
              formik.setFieldValue("phoneNumber", e.target.value, true)
            }
            onBlur={formik.handleBlur}
            name="phoneNumber"
            className={inputClass(phoneError)}
          />
          {phoneError && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.phoneNumber}
            </p>
          )}
        </label>
      </div>

      <div className="border-t border-slate-100 px-5 py-6 sm:px-6">
        <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
          <div className="flex gap-3">
            <ShieldCheckIcon className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm leading-6 text-amber-800">
              Changing your password signs you out so you can sign in again with
              the new credentials.
            </p>
          </div>
        </div>

        <label className="block max-w-xl">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2D3648]">
            <KeyIcon className="h-4 w-4 text-[#1F5FD6]" />
            New password
          </span>
          <input
            type="password"
            value={formik.values.newPassword}
            onChange={(e) =>
              formik.setFieldValue("newPassword", e.target.value, true)
            }
            onBlur={formik.handleBlur}
            name="newPassword"
            className={inputClass(passwordError)}
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.newPassword}
            </p>
          )}
        </label>
      </div>

      {updateUser.isError && (
        <div className="mx-5 mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 sm:mx-6">
          {updateUser?.error?.message ||
            "Something went wrong. Please try again"}
        </div>
      )}

      <div className="flex justify-end border-t border-slate-100 px-5 py-5 sm:px-6">
        <button
          type="submit"
          disabled={updateUser.isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184FB5] disabled:opacity-50"
        >
          {updateUser.isLoading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
};
