// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useCompanyMemberships } from "@/providers/Memberships";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AddressAutocomplete } from "@/app/components/propertyPlacementEdit/AddressAutocomplete";
import { useCreateCompany, useUpdateCompany } from "@/providers/Companies";
import { AutocompleteAddress } from "@/types";
import { toast } from "react-toastify";
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/components/shared/Button";

const CompanyCreateUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Required"),
  phoneNumber: Yup.string()
    .min(8, "Phone number is too short")
    .max(50, "Phone number is too long"),
  email: Yup.string().email("Invalid email").required("Required"),
  description: Yup.string(),
});

interface FormValues {
  id?: string | number;
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  address: {
    id?: string | number;
    locality: string;
    route: string;
    streetNumber: string;
    administrativeArea: string;
    postalCode: string;
    latitude: string;
    longitude: string;
  };
}

const initialCompanyState: FormValues = {
  id: "",
  name: "",
  phoneNumber: "",
  email: "",
  description: "",
  address: {
    id: "",
    locality: "",
    route: "",
    streetNumber: "",
    administrativeArea: "",
    postalCode: "",
    latitude: "",
    longitude: "",
  },
};

const inputClass = (hasError?: boolean) =>
  `h-10 w-full rounded-xl border bg-white px-3 text-sm text-[#2D3648] outline-none transition focus:ring-2 disabled:bg-[#F8FAFC] disabled:text-[#64748B] ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
      : "border-slate-200 focus:border-[#1F5FD6] focus:ring-[#1F5FD6]/15"
  }`;

export const CompanyTab = () => {
  const { authToken } = useAuthContext();
  const companyMemberships = useCompanyMemberships({ authToken });
  const [company, setCompany] = useState<FormValues>(initialCompanyState);
  const [formSubmitMethod, setFormSubmitMethod] = useState("POST");
  const createCompany = useCreateCompany({ authToken });
  const updateCompany = useUpdateCompany({ authToken });
  const [showAddress, setShowAddress] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: company,
    validationSchema: CompanyCreateUpdateSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleAddressChange = (address: AutocompleteAddress) => {
    if (!address) return;
    const addressId = formik.values.address.id;
    formik.setFieldValue("address", { id: addressId, ...address });
    setShowAddress(true);
  };

  const handleFormSubmit = async (values: FormValues) => {
    try {
      if (formSubmitMethod == "PUT") {
        await updateCompany.mutateAsync(values);
        toast.success("Company updated successfully");
        return;
      }
      await createCompany.mutateAsync(values);
      toast.success("Company created successfully");
    } catch (error) {
      toast.error(
        "There was an error creating the company: " + error?.message ||
          "Something went wrong. Please try again",
      );
    }
  };

  useEffect(() => {
    if (!companyMemberships.isSuccess || !companyMemberships?.data) return;
    const membershipCompany = companyMemberships.data?.company;
    if (!membershipCompany) return;
    const companyAddress = membershipCompany.Address?.[0];
    if (companyAddress?.locality) setShowAddress(true);
    setFormSubmitMethod("PUT");
    setCompany({
      ...membershipCompany,
      description: membershipCompany.description || "",
      address: { ...initialCompanyState.address, ...companyAddress },
    });
  }, [companyMemberships.data, companyMemberships.isSuccess]);

  const isSubmitting = createCompany.isLoading || updateCompany.isLoading;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
            <BuildingOffice2Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#2D3648]">
              {formSubmitMethod === "PUT"
                ? "Company details"
                : "Create company"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-[#717D96]">
              Use this profile for agency-owned listings and company contact
              details.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:px-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2D3648]">
            <BuildingOffice2Icon className="h-4 w-4 text-[#1F5FD6]" />
            Company name
          </span>
          <input
            type="text"
            value={formik.values.name}
            onChange={(e) => formik.setFieldValue("name", e.target.value, true)}
            onBlur={formik.handleBlur}
            name="name"
            className={inputClass(
              Boolean(formik.errors.name && formik.touched.name),
            )}
          />
          {formik.errors.name && formik.touched.name && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
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
            className={inputClass(
              Boolean(formik.errors.phoneNumber && formik.touched.phoneNumber),
            )}
          />
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.phoneNumber}
            </p>
          )}
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2D3648]">
            <EnvelopeIcon className="h-4 w-4 text-[#1F5FD6]" />
            Email
          </span>
          <input
            type="email"
            value={formik.values.email}
            onChange={(e) =>
              formik.setFieldValue("email", e.target.value, true)
            }
            onBlur={formik.handleBlur}
            name="email"
            className={inputClass(
              Boolean(formik.errors.email && formik.touched.email),
            )}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
          )}
        </label>
      </div>

      <div className="border-t border-slate-100 px-5 py-6 sm:px-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
            <MapPinIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-[#2D3648]">Office address</h3>
            <p className="mt-1 text-sm leading-6 text-[#717D96]">
              Search for the address and confirm the structured location data.
            </p>
          </div>
        </div>

        <div className="mb-5">
          <AddressAutocomplete onAddressChange={handleAddressChange} />
        </div>

        {showAddress && (
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                House number
              </span>
              <input
                type="text"
                value={formik.values.address.streetNumber}
                onChange={(e) =>
                  formik.setFieldValue(
                    "address.streetNumber",
                    e.target.value,
                    true,
                  )
                }
                className={inputClass()}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                Street
              </span>
              <input
                type="text"
                value={formik.values.address.route}
                disabled
                className={inputClass()}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                City
              </span>
              <input
                type="text"
                value={formik.values.address.locality}
                disabled
                className={inputClass()}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                Administrative area
              </span>
              <input
                type="text"
                value={formik.values.address.administrativeArea}
                disabled
                className={inputClass()}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                Postal code
              </span>
              <input
                type="text"
                value={formik.values.address.postalCode}
                disabled
                className={inputClass()}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                  Latitude
                </span>
                <input
                  type="text"
                  value={formik.values.address.latitude}
                  disabled
                  className={inputClass()}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#2D3648]">
                  Longitude
                </span>
                <input
                  type="text"
                  value={formik.values.address.longitude}
                  disabled
                  className={inputClass()}
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-5 py-6 sm:px-6">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#2D3648]">
            <PencilSquareIcon className="h-4 w-4 text-[#1F5FD6]" />
            Description
          </span>
          <textarea
            value={formik.values.description}
            onChange={(e) =>
              formik.setFieldValue("description", e.target.value, true)
            }
            className="focus:ring-[#1F5FD6]/15 min-h-[150px] w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-[#4A5468] outline-0 transition focus:border-[#1F5FD6] focus:ring-2"
          />
          {formik.errors.description && formik.touched.description && (
            <p className="mt-2 text-sm text-rose-600">
              {formik.errors.description}
            </p>
          )}
        </label>
      </div>

      {(createCompany.isError || updateCompany.isError) && (
        <div className="mx-5 mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 sm:mx-6">
          {createCompany?.error?.message ||
            updateCompany?.error?.message ||
            "Something went wrong. Please try again"}
        </div>
      )}

      <div className="flex justify-end border-t border-slate-100 px-5 py-5 sm:px-6">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : formSubmitMethod === "PUT"
              ? "Save company"
              : "Create company"}
        </Button>
      </div>
    </form>
  );
};
