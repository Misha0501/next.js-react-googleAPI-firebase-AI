"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button, TextInput } from "@tremor/react";
import { toast } from "react-toastify";
import { useUpdateUser, useUserOwnData } from "@/providers/Users";
import { useRouter } from "next/navigation";
import { signOut } from "@firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";

const ApplicationUserUpdateSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Required"),
  phoneNumber: Yup.string()
    .min(8, "Phone number is too short")
    .max(50, "Phone number is too long"),
  newPassword: Yup.string().min(6, "The password must be a string with at least 6 characters.").max(50, "The password must be a string of up to 50 characters."),
});

interface FormValues {
  displayName: string;
  phoneNumber: string;
  newPassword: string,
}

export const PersonalDetailsTab = () => {
  const { authToken } = useAuthContext();
  const [personalDetails, setPersonalDetails] = useState({
    displayName: "",
    phoneNumber: "",
    newPassword: "",
  });

  const router = useRouter()

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

      // redirect to login if changed password
      if(values.newPassword) {
        await signOut(firebaseClientAuth);
        router.push("/signin")
      }

      return;
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again");
    }
  };

  useEffect(() => {
    if (userData.isSuccess && userData.data) {
      setPersonalDetails({
        displayName: userData.data?.displayName,
        phoneNumber: userData.data?.phoneNumber,
      });
    }


  }, [userData.data, userData.isSuccess]);

  return (
    <div className="mt-10 w-full">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-7">
          <p className={"mb-2"}>Display Name</p>
          <TextInput
            defaultValue={formik.values.displayName}
            onChange={(event) => {
              formik.values.displayName = event.target.value;
            }}
            errorMessage={
              formik.errors.displayName && formik.touched.displayName
                ? formik.errors.displayName
                : undefined
            }
            error={
              formik.errors.displayName && formik.touched.displayName
                ? true
                : undefined
            }
          />
        </div>
        <div className="mb-7">
          <p className={"mb-2"}>Phone number</p>
          <TextInput
            defaultValue={formik.values.phoneNumber}
            onChange={(event) => {
              formik.values.phoneNumber = event.target.value;
            }}
            errorMessage={
              formik.errors.phoneNumber && formik.touched.phoneNumber
                ? formik.errors.phoneNumber
                : undefined
            }
            error={
              formik.errors.phoneNumber && formik.touched.phoneNumber
                ? true
                : undefined
            }
          />
        </div>
        <div className="mb-7">
          <p className={"mb-1"}>New password</p>
          <p className={"text-gray-500 mb-2"}>After resetting the password you will be redirected to the sing in page</p>
          <TextInput
            defaultValue={formik.values.newPassword}
            onChange={(event) => {
              formik.values.newPassword = event.target.value;
            }}
            errorMessage={
              formik.errors.newPassword && formik.touched.newPassword
                ? formik.errors.newPassword
                : undefined
            }
            error={
              formik.errors.newPassword && formik.touched.newPassword
                ? true
                : undefined
            }
          />
        </div>
        {updateUser.isError && (
          <div className="mb-7">
            <p className={"mb-2 text-red-600"}>
              {updateUser?.error?.message ||
                "Something went wrong. Please try again"}
            </p>
          </div>
        )}
        <Button type={"submit"} disabled={updateUser.isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
};
