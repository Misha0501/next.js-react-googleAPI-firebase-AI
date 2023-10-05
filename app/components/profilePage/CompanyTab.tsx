"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useCompanyMemberships } from "@/providers/Memberships";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button, TextInput } from "@tremor/react";
import { AddressAutocomplete } from "@/app/components/propertyPlacement/AddressAutocomplete";
import { useCreateCompany, useUpdateCompany } from "@/providers/Companies";
import { AutocompleteAddress } from "@/types";
import { toast } from "react-toastify";

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
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  address: {
    locality: string;
    route: string;
    streetNumber: string;
    administrativeArea: string;
    postalCode: string;
    latitude: string;
    longitude: string;
  };
}

export const CompanyTab = () => {
  const { authToken } = useAuthContext();
  const companyMemberships = useCompanyMemberships({ authToken });
  const [company, setCompany] = useState({
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
  });
  const [formSubmitMethod, setFormSubmitMethod] = useState("POST");
  const createCompany = useCreateCompany({ authToken });
  const updateCompany = useUpdateCompany({ authToken });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: company,
    validationSchema: CompanyCreateUpdateSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });
  const [showAddress, setShowAddress] = useState(false);

  const handleAddressChange = (address: AutocompleteAddress) => {
    if (!address) return;

    formik.setFieldValue("address", address);
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
        "There was an error creating the company: " +
        error?.message ||
        "Something went wrong. Please try again",
      );
    }
  };

  useEffect(() => {
    if (
      companyMemberships.isSuccess &&
      companyMemberships?.data &&
      companyMemberships?.data?.length !== 0
    ) {
      let company = companyMemberships.data?.company;
      if (!company) return;
      const companyAddress = company.Address?.[0];

      if (companyAddress?.locality) {
        setShowAddress(true);
      }
      setFormSubmitMethod("PUT");
      setCompany({ ...company, address: { ...companyAddress } });
    }
  }, [companyMemberships.data, companyMemberships.isSuccess]);

  return (
    <div className="mt-10 w-full">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-7">
          <p className={"mb-2"}>Company name</p>
          <TextInput
            defaultValue={formik.values.name}
            onChange={(event) => {
              formik.values.name = event.target.value;
            }}
            errorMessage={
              formik.errors.name && formik.touched.name
                ? formik.errors.name
                : undefined
            }
            error={formik.errors.name && formik.touched.name ? true : undefined}
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
          <p className={"mb-2"}>Email</p>
          <TextInput
            defaultValue={formik.values.email}
            onChange={(event) => {
              formik.values.email = event.target.value;
            }}
            errorMessage={
              formik.errors.email && formik.touched.email
                ? formik.errors.email
                : undefined
            }
            error={
              formik.errors.email && formik.touched.email ? true : undefined
            }
          />
        </div>
        <div className="mb-7">
          <p className={"mb-2"}>Type your address</p>
          <AddressAutocomplete onAddressChange={handleAddressChange} />
        </div>
        {showAddress && (
          <div className="">
            <div className="mb-7">
              <p className={"mb-2"}>House number</p>
              <TextInput
                value={formik.values.address.streetNumber}
                onChange={(e) =>
                  formik.setFieldValue("streetNumber", e.target.value, true)
                }
              />
            </div>
            <div className="mb-7">
              <p className={"mb-2"}>Street</p>
              <TextInput value={formik.values.address.route} disabled />
            </div>
            <div className="mb-7">
              <p className={"mb-2"}>City</p>
              <TextInput value={formik.values.address.locality} disabled />
            </div>
            <div className="mb-7">
              <p className={"mb-2"}>Administrative area</p>
              <TextInput
                value={formik.values.address.administrativeArea}
                disabled
              />
            </div>
            <div className="mb-7">
              <p className={"mb-2"}>Postal Code</p>
              <TextInput value={formik.values.address.postalCode} disabled />
            </div>
            <div className="mb-7">
              <p className={"mb-2"}>Latitude</p>
              <TextInput value={formik.values.address.latitude} disabled />
            </div>
            <div className="mb-7">
              <p className={"mb-2"}>Longitude</p>
              <TextInput value={formik.values.address.longitude} disabled />
            </div>
          </div>
        )}
        <div className="mb-7">
          <p className={"mb-2"}>Description</p>
          <textarea
            defaultValue={formik.values.description}
            onChange={(event) => {
              formik.values.description = event.target.value;
            }}
            className={
              "border-2 border-gray-100 rounded-md w-full outline-0 min-h-[150px] p-3 text-gray-500 text-md"
            }
          />
          {formik.errors.description && formik.touched.description ? (
            <div>{formik.errors.description}</div>
          ) : null}
        </div>
        {createCompany.isError && (
          <div className="mb-7">
            <p className={"mb-2 text-red-600"}>
              {createCompany?.error?.message ||
                "Something went wrong. Please try again"}
            </p>
          </div>
        )}
        {updateCompany.isError && (
          <div className="mb-7">
            <p className={"mb-2 text-red-600"}>
              {updateCompany?.error?.message ||
                "Something went wrong. Please try again"}
            </p>
          </div>
        )}
        <Button type={"submit"} disabled={createCompany.isLoading || updateCompany.isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
};
