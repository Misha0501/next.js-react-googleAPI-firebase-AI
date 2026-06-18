"use client";

import {
  BanknotesIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  MapPinIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import property1 from "@/public/property1.png";
import StepsTopInfo from "@/app/components/propertyPlacementEdit/StepsTopInfo";
import { LISTING_TYPES, PROPERTY_TYPES } from "@/app/lib/constants";
import React, { useEffect, useState } from "react";
import PropertyPlacementRadioButtons from "@/app/components/propertyPlacementEdit/PropertyPlacementRadioButtons";
import SingleSelectRadioButton from "@/app/components/propertyPlacementEdit/SingleSelectRadioButton";
import { AutocompleteAddress, Company } from "@/types";
import { AddressAutocomplete } from "@/app/components/propertyPlacementEdit/AddressAutocomplete";
import {
  applyStepErrors,
  getGeneralInfoFields,
  PlacementFormValues,
  validateGeneralInfo,
} from "@/app/components/propertyPlacementEdit/validation";
import { FormikProps } from "formik";

interface CreatePropertyComponentPropInterface {
  formik: FormikProps<PlacementFormValues>;
  handleNext: () => void;
  step: number;
  isShow: boolean;
  company?: Pick<Company, "id" | "name"> | null;
}

const LIST_AS_MYSELF = "Myself";

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#1F2937] outline-none transition focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15 disabled:bg-[#F8FAFC] disabled:text-[#64748B]";

const ErrorText = ({ children }: { children?: React.ReactNode }) => {
  if (!children) return null;

  return <p className="mt-2 text-sm font-semibold text-red-600">{children}</p>;
};

const SectionRow = ({ icon, title, description, children }: SectionProps) => (
  <section className="grid gap-5 border-b border-slate-200 py-8 last:border-b-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
        {icon}
      </span>
      <div>
        <h3 className="text-xl font-bold text-[#1F2937]">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">
          {description}
        </p>
      </div>
    </div>
    <div>{children}</div>
  </section>
);

const GeneralInfo = ({
  formik,
  handleNext,
  step,
  isShow,
  company,
}: CreatePropertyComponentPropInterface) => {
  const [show, setShow] = useState(true);
  const [showError, setShowErrors] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState(
    formik.values.price
      ? new Intl.NumberFormat("bg-BG").format(Number(formik.values.price))
      : "",
  );

  // Default to "list as the company" the first time company data loads, to
  // preserve the prior auto-assign behavior for anyone who doesn't change it.
  useEffect(() => {
    if (company && formik.values.companyId === undefined) {
      formik.setFieldValue("companyId", company.id, false);
    }
  }, [company, formik]);

  const listAsValue =
    company && formik.values.companyId === company.id
      ? company.name
      : LIST_AS_MYSELF;

  const handleListAsChange = (value: string) => {
    if (!company) return;
    formik.setFieldValue(
      "companyId",
      value === company.name ? company.id : null,
      false,
    );
  };

  const [showAddress, setShowAddress] = useState(
    Boolean(
      formik.values.route ||
      formik.values.administrativeArea ||
      formik.values.locality ||
      formik.values.streetNumber ||
      formik.values.postalCode ||
      formik.values.latitude ||
      formik.values.longitude,
    ),
  );

  const title = "Add the essentials";
  const stepNumber = "Step 1";

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");

    if (!digits) {
      setPriceDisplay("");
      formik.setFieldValue("price", "", true);
      return;
    }

    const numericPrice = parseInt(digits, 10);
    setPriceDisplay(new Intl.NumberFormat("bg-BG").format(numericPrice));
    formik.setFieldValue("price", numericPrice, true);
  };

  const handleAddressChange = (address: AutocompleteAddress) => {
    if (!address) return;

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
    formik.setFieldError("locality", undefined);
    setShowAddress(true);
  };

  const handleContinue = () => {
    const errors = validateGeneralInfo(formik.values);
    applyStepErrors(formik, getGeneralInfoFields(), errors);

    if (Object.keys(errors).length === 0) {
      handleNext();
      return;
    }

    setShowErrors(true);
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      {isShow && show ? (
        <StepsTopInfo
          stepNumber={stepNumber}
          title="Start with the core property details"
          description="Set the offer type, choose the property type, select the real address, and add the asking price. These details drive how the property is presented and searched."
          imageSrc={property1}
          step={step}
          onClick={() => setShow(false)}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-3 text-sm font-bold tracking-wide text-[#1F5FD6] uppercase">
            {stepNumber}
          </div>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B] md:text-base">
              Keep this part precise. It becomes the headline information buyers
              see first.
            </p>
          </div>

          <div className="mt-4">
            {company && (
              <SectionRow
                icon={<BuildingOffice2Icon className="h-5 w-5" />}
                title="List as"
                description="Post this property as yourself or under your company's name."
              >
                <SingleSelectRadioButton
                  id="companyId"
                  value={listAsValue}
                  options={[LIST_AS_MYSELF, company.name]}
                  onChange={handleListAsChange}
                />
              </SectionRow>
            )}

            <SectionRow
              icon={<HomeModernIcon className="h-5 w-5" />}
              title="Offer type"
              description="Choose whether this property is being sold or offered for rent."
            >
              <PropertyPlacementRadioButtons
                value={formik.values.listingType}
                options={LISTING_TYPES}
                onChange={(value) =>
                  formik.setFieldValue("listingType", value, true)
                }
                id="listingType"
              />
              {showError && (
                <ErrorText>{formik.errors.listingType as string}</ErrorText>
              )}
            </SectionRow>

            <SectionRow
              icon={<TagIcon className="h-5 w-5" />}
              title="Property type"
              description="Pick the closest category so filters and recommendations work correctly."
            >
              <select
                id="propertyType"
                name="propertyType"
                value={formik.values.propertyType}
                onChange={(event) =>
                  formik.setFieldValue("propertyType", event.target.value, true)
                }
                onBlur={formik.handleBlur}
                className={inputClass}
              >
                <option value="" disabled>
                  Select property type
                </option>
                {PROPERTY_TYPES.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              {showError && (
                <ErrorText>{formik.errors.propertyType as string}</ErrorText>
              )}
            </SectionRow>

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
                  <AddressAutocomplete onAddressChange={handleAddressChange} />
                  {showError && (
                    <ErrorText>{formik.errors.locality as string}</ErrorText>
                  )}
                </div>

                {showAddress && (
                  <div className="grid gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#64748B] uppercase">
                        House number
                      </p>
                      <input
                        value={formik.values.streetNumber}
                        className={inputClass}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#64748B] uppercase">
                        Street
                      </p>
                      <input
                        value={formik.values.route}
                        className={inputClass}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#64748B] uppercase">
                        Neighborhood
                      </p>
                      <input
                        value={formik.values.neighborhood}
                        className={inputClass}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#64748B] uppercase">
                        City
                      </p>
                      <input
                        value={formik.values.locality}
                        className={inputClass}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#64748B] uppercase">
                        Administrative area
                      </p>
                      <input
                        value={formik.values.administrativeArea}
                        className={inputClass}
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#64748B] uppercase">
                        Postal code
                      </p>
                      <input
                        value={formik.values.postalCode}
                        className={inputClass}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            </SectionRow>

            <SectionRow
              icon={<BanknotesIcon className="h-5 w-5" />}
              title="Asking price"
              description="Prices are stored in euro and displayed with Bulgarian number formatting."
            >
              <label
                className="mb-2 block text-sm font-bold text-[#1F2937]"
                htmlFor="price"
              >
                Price
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-[#64748B]">
                  €
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  id="price"
                  name="price"
                  placeholder="0"
                  value={priceDisplay}
                  onChange={handlePriceChange}
                  onBlur={formik.handleBlur}
                  className={`${inputClass} pl-9`}
                />
              </div>
              {showError && (
                <ErrorText>{formik.errors.price as string}</ErrorText>
              )}
            </SectionRow>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#1F5FD6] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] sm:w-auto"
            >
              Continue to details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInfo;
