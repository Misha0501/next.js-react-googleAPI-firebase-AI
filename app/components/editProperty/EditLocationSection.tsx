"use client";

import { useMemo } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { FormikProps } from "formik";
import { AutocompleteAddress } from "@/types";
import { AddressAutocomplete } from "@/app/components/propertyPlacementEdit/AddressAutocomplete";
import { EditPropertyValues } from "@/app/components/editProperty/types";
import { SectionRow, ErrorText } from "@/app/components/editProperty/editFormPrimitives";

const disabledInputClass =
  "w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#64748B] outline-none";

type Props = {
  formik: FormikProps<EditPropertyValues>;
  showError: boolean;
};

export const EditLocationSection = ({ formik, showError }: Props) => {
  const hasAddress = Boolean(
    formik.values.route || formik.values.locality || formik.values.streetNumber,
  );

  const initialAddressValue = useMemo(() => {
    const { streetNumber, route, locality } = formik.values;
    return [streetNumber, route, locality].filter(Boolean).join(", ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressChange = (address: AutocompleteAddress) => {
    formik.setFieldValue("route", address.route, true);
    formik.setFieldValue("neighborhood", address.neighborhood, true);
    formik.setFieldValue("streetNumber", address.streetNumber, true);
    formik.setFieldValue("locality", address.locality, true);
    formik.setFieldValue(
      "administrativeArea",
      address.administrativeAreaLevelOne,
      true,
    );
    formik.setFieldValue("postalCode", address.postalCode, true);
    formik.setFieldValue("latitude", address.latitude, true);
    formik.setFieldValue("longitude", address.longitude, true);
  };

  return (
    <SectionRow
      icon={<MapPinIcon className="h-5 w-5" />}
      title="Location"
      description="Select the address from Google suggestions so the map and locality data are stored correctly."
    >
      <div className="space-y-5">
        <div>
          <label
            className="mb-2 block text-sm font-bold text-[#1F2937]"
            htmlFor="address"
          >
            Address
          </label>
          <AddressAutocomplete
            initialValue={initialAddressValue}
            onAddressChange={handleAddressChange}
          />
          {showError && (
            <ErrorText>{formik.errors.locality as string}</ErrorText>
          )}
        </div>

        {hasAddress && (
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#64748B]">
                House number
              </p>
              <input
                value={formik.values.streetNumber ?? ""}
                className={disabledInputClass}
                disabled
                readOnly
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#64748B]">
                Street
              </p>
              <input
                value={formik.values.route ?? ""}
                className={disabledInputClass}
                disabled
                readOnly
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#64748B]">
                Neighborhood
              </p>
              <input
                value={formik.values.neighborhood ?? ""}
                className={disabledInputClass}
                disabled
                readOnly
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#64748B]">
                City
              </p>
              <input
                value={formik.values.locality ?? ""}
                className={disabledInputClass}
                disabled
                readOnly
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#64748B]">
                Administrative area
              </p>
              <input
                value={formik.values.administrativeArea ?? ""}
                className={disabledInputClass}
                disabled
                readOnly
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#64748B]">
                Postal code
              </p>
              <input
                value={formik.values.postalCode ?? ""}
                className={disabledInputClass}
                disabled
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </SectionRow>
  );
};
