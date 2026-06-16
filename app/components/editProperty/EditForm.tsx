"use client";

import React, { useMemo, useState } from "react";
import { useUpdateProperty } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BanknotesIcon,
  HomeModernIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { FormikProps } from "formik";
import { Listing } from "@/types";
import { CURRENCIES, LISTING_TYPES, PROPERTY_TYPES } from "@/app/lib/constants";
import PropertyPlacementRadioButtons from "@/app/components/propertyPlacementEdit/PropertyPlacementRadioButtons";
import {
  EditPropertyValues,
  ErrorMap,
} from "@/app/components/editProperty/types";
import {
  ErrorText,
  SectionRow,
  inputClass,
} from "@/app/components/editProperty/editFormPrimitives";
import { EditLocationSection } from "@/app/components/editProperty/EditLocationSection";
import { EditDetailsSection } from "@/app/components/editProperty/EditDetailsSection";
import { EditMediaSection } from "@/app/components/editProperty/EditMediaSection";

export type { EditPropertyValues };

type EditFormProps = {
  formik: FormikProps<EditPropertyValues>;
  addressId?: number;
  id?: number;
  loading?: boolean;
};

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isPositive = (value: unknown) => {
  const parsed = toNumber(value);
  return parsed !== null && parsed > 0;
};

const isNonNegative = (value: unknown) => {
  const parsed = toNumber(value);
  return parsed === null || parsed >= 0;
};

const toPayloadNumber = (value: unknown) => {
  const parsed = toNumber(value);
  return parsed === null ? undefined : parsed;
};

const markFieldsTouched = (
  formik: FormikProps<EditPropertyValues>,
  fields: (keyof EditPropertyValues)[],
) => {
  fields.forEach((field) => formik.setFieldTouched(field, true, false));
};

const validateEditForm = (values: EditPropertyValues) => {
  const errors: ErrorMap = {};
  const isLand = values.propertyType === "LAND";
  const currentYear = new Date().getFullYear();

  if (!values.listingType)
    errors.listingType = "Choose if this is for sale or rent";
  if (!values.propertyType) errors.propertyType = "Select a property type";
  if (!values.currency) errors.currency = "Select a currency";
  if (!isPositive(values.price)) errors.price = "Enter a price greater than 0";
  if (!isPositive(values.totalArea)) errors.totalArea = "Enter the total area";

  const numericFields: [keyof EditPropertyValues, string][] = [
    ["rooms", "Rooms"],
    ["bedrooms", "Bedrooms"],
    ["bathrooms", "Bathrooms"],
    ["parking", "Parking places"],
    ["livingArea", "Living area"],
    ["areaOutside", "Outside area"],
    ["areaGarage", "Garage area"],
    ["volume", "Volume"],
    ["numberOfFloorsCommon", "Floors"],
    ["floorNumber", "Floor number"],
  ];

  numericFields.forEach(([field, label]) => {
    if (!isNonNegative(values[field])) {
      errors[field] = `${label} cannot be negative`;
    }
  });

  if (!isLand) {
    if (!values.interiorType) errors.interiorType = "Choose the interior type";
    if (!values.upkeepType) errors.upkeepType = "Choose the property condition";
    if (!values.heatingType) errors.heatingType = "Choose the heating type";
  }

  const constructedYear = toNumber(values.constructedYear);
  if (
    constructedYear !== null &&
    (constructedYear < 1900 || constructedYear > currentYear + 10)
  ) {
    errors.constructedYear = `Use a year between 1900 and ${currentYear + 10}`;
  }

  const floorNumber = toNumber(values.floorNumber);
  const floors = toNumber(values.numberOfFloorsCommon);
  if (floorNumber !== null && floors !== null && floorNumber > floors) {
    errors.floorNumber = "Floor number cannot be higher than total floors";
  }

  const description = values.description?.trim() || "";
  if (!description) {
    errors.description = "Add a property description";
  } else if (description.length < 30) {
    errors.description = "Write at least 30 characters";
  }

  return errors;
};

const errorFields = (
  values: EditPropertyValues,
): (keyof EditPropertyValues)[] => [
  "listingType",
  "propertyType",
  "currency",
  "price",
  "totalArea",
  "rooms",
  "bedrooms",
  "bathrooms",
  "parking",
  "livingArea",
  "areaOutside",
  "areaGarage",
  "volume",
  ...(values.propertyType !== "LAND"
    ? (["interiorType", "upkeepType", "heatingType"] as const)
    : []),
  "constructedYear",
  "numberOfFloorsCommon",
  "floorNumber",
  "description",
];

const EditForm = ({ formik, addressId, id, loading }: EditFormProps) => {
  const [showError, setShowErrors] = useState(false);
  const { authToken } = useAuthContext();
  const updateProperty = useUpdateProperty({ authToken });
  const router = useRouter();

  const priceDisplay = useMemo(() => {
    if (!formik.values.price) return "";
    return new Intl.NumberFormat("bg-BG").format(Number(formik.values.price));
  }, [formik.values.price]);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");
    if (!digits) {
      formik.setFieldValue("price", "", true);
      return;
    }
    formik.setFieldValue("price", parseInt(digits, 10), true);
  };

  const submitHandler = async () => {
    if (!id) {
      toast.error("Property id is missing.");
      return;
    }

    const errors = validateEditForm(formik.values);
    markFieldsTouched(formik, errorFields(formik.values));
    formik.setErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }

    const isLand = formik.values.propertyType === "LAND";
    const constructedYear = toPayloadNumber(formik.values.constructedYear);

    const values: Record<string, unknown> = {
      id,
      listingType: formik.values.listingType,
      propertyType: formik.values.propertyType,
      currency: formik.values.currency,
      price: toPayloadNumber(formik.values.price),
      rooms: toPayloadNumber(formik.values.rooms),
      bedrooms: toPayloadNumber(formik.values.bedrooms),
      bathrooms: toPayloadNumber(formik.values.bathrooms),
      parking: toPayloadNumber(formik.values.parking),
      areaTotal: toPayloadNumber(formik.values.totalArea),
      areaLiving: toPayloadNumber(formik.values.livingArea),
      areaOutside: toPayloadNumber(formik.values.areaOutside),
      areaGarage: toPayloadNumber(formik.values.areaGarage),
      volume: toPayloadNumber(formik.values.volume),
      interiorType: isLand ? null : formik.values.interiorType || null,
      upkeepType: isLand ? null : formik.values.upkeepType || null,
      heatingType: isLand ? null : formik.values.heatingType || null,
      constructedYear:
        constructedYear === undefined ? undefined : String(constructedYear),
      numberOfFloorsCommon: toPayloadNumber(formik.values.numberOfFloorsCommon),
      floorNumber: toPayloadNumber(formik.values.floorNumber),
      description: formik.values.description?.trim(),
      images: formik.values.images || [],
    };

    if (addressId) {
      values.address = {
        route: formik.values.route,
        administrativeAreaLevelOne: formik.values.administrativeArea,
        locality: formik.values.locality,
        streetNumber: formik.values.streetNumber,
        neighborhood: formik.values.neighborhood,
        postalCode: formik.values.postalCode,
        latitude: formik.values.latitude,
        longitude: formik.values.longitude,
        id: addressId,
      };
    }

    Object.keys(values).forEach((key) => {
      if (values[key] === undefined || values[key] === "") {
        delete values[key];
      }
    });

    try {
      await updateProperty.mutateAsync(values as Listing);
      toast.success("Property updated successfully");
      router.push("/profile/myProperties");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating property",
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#CFE0FF] border-t-[#1F5FD6]" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submitHandler();
      }}
      className="space-y-8"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
          Edit property
        </div>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937] md:text-4xl">
            Update property details
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#64748B] md:text-base">
            Keep the property accurate and complete. Changes are saved to the
            live property after review.
          </p>
        </div>

        <div className="mt-4">
          <SectionRow
            icon={<HomeModernIcon className="h-5 w-5" />}
            title="Offer type"
            description="Update whether this property is offered for sale or rent."
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
            description="Choose the current category used by property filters."
          >
            <select
              id="propertyType"
              name="propertyType"
              value={formik.values.propertyType || ""}
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

          <EditLocationSection formik={formik} showError={showError} />

          <SectionRow
            icon={<BanknotesIcon className="h-5 w-5" />}
            title="Price"
            description="Prices are stored in euro and displayed with Bulgarian number formatting."
          >
            <div className="grid gap-4 sm:grid-cols-[0.55fr_1fr]">
              <div>
                <label
                  className="mb-2 block text-sm font-bold text-[#1F2937]"
                  htmlFor="currency"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formik.values.currency || "EUR"}
                  onChange={(event) =>
                    formik.setFieldValue("currency", event.target.value, true)
                  }
                  onBlur={formik.handleBlur}
                  className={inputClass}
                >
                  {CURRENCIES.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {showError && (
                  <ErrorText>{formik.errors.currency as string}</ErrorText>
                )}
              </div>
              <div>
                <label
                  className="mb-2 block text-sm font-bold text-[#1F2937]"
                  htmlFor="price"
                >
                  Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
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
              </div>
            </div>
          </SectionRow>

          <EditDetailsSection formik={formik} showError={showError} />

          <EditMediaSection formik={formik} showError={showError} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/profile/myProperties")}
            className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#334155] transition hover:border-[#1F5FD6] hover:text-[#1F5FD6] sm:w-auto"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to profile
          </button>
          <button
            type="submit"
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#1F5FD6] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] disabled:opacity-50 sm:w-auto"
            disabled={updateProperty.isLoading}
          >
            {updateProperty.isLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditForm;
