"use client";

import React, { useMemo, useState } from "react";
import { PlacingPropertyImagesHandler } from "../propertyPlacementEdit/PlacingPropertyImagesHandler";
import {
  CURRENCIES,
  HEATING_TYPES,
  INTERIOR_TYPES,
  LISTING_TYPES,
  PROPERTY_TYPES,
  UPKEEP_TYPES,
} from "../../lib/constants";
import SingleSelectRadioButton from "../propertyPlacementEdit/SingleSelectRadioButton";
import PropertyPlacementRadioButtons from "../propertyPlacementEdit/PropertyPlacementRadioButtons";
import { useUpdateProperty } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  HomeModernIcon,
  MapPinIcon,
  PhotoIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { FormikProps } from "formik";
import { ListingImage } from "@/types";

export type EditPropertyValues = {
  listingType?: string;
  propertyType?: string;
  streetNumber?: string;
  route?: string;
  locality?: string;
  neighborhood?: string;
  administrativeArea?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  currency?: string;
  price?: number | string;
  rooms?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  parking?: number | string;
  totalArea?: number | string;
  livingArea?: number | string;
  areaOutside?: number | string;
  areaGarage?: number | string;
  volume?: number | string;
  interiorType?: string;
  upkeepType?: string;
  heatingType?: string;
  constructedYear?: number | string;
  numberOfFloorsCommon?: number | string;
  floorNumber?: number | string;
  description?: string;
  images: ListingImage[];
};

type EditFormProps = {
  formik: FormikProps<EditPropertyValues>;
  addressId?: number;
  id?: number;
  loading?: boolean;
};

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

type ErrorMap = Partial<Record<keyof EditPropertyValues, string>>;

type NumberFieldProps = {
  formik: FormikProps<EditPropertyValues>;
  name: keyof EditPropertyValues;
  label: string;
  unit?: string;
  min?: number;
  max?: number;
  error?: string;
};

type TextFieldProps = {
  formik: FormikProps<EditPropertyValues>;
  name: keyof EditPropertyValues;
  label: string;
  error?: string;
};

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

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

const NumberField = ({
  formik,
  name,
  label,
  unit,
  min = 0,
  max,
  error,
}: NumberFieldProps) => (
  <div>
    <label
      className="mb-2 block text-sm font-bold text-[#1F2937]"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type="number"
        min={min}
        max={max}
        value={(formik.values[name] ?? "") as string | number}
        onChange={(event) =>
          formik.setFieldValue(
            name,
            event.target.value === "" ? undefined : Number(event.target.value),
            true,
          )
        }
        onBlur={formik.handleBlur}
        className={`${inputClass} ${unit ? "pr-12" : ""}`}
        placeholder="0"
      />
      {unit && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
          {unit}
        </span>
      )}
    </div>
    <ErrorText>{error}</ErrorText>
  </div>
);

const TextField = ({ formik, name, label, error }: TextFieldProps) => (
  <div>
    <label
      className="mb-2 block text-sm font-bold text-[#1F2937]"
      htmlFor={name}
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      value={(formik.values[name] ?? "") as string}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className={inputClass}
    />
    <ErrorText>{error}</ErrorText>
  </div>
);

const markFieldsTouched = (
  formik: FormikProps<EditPropertyValues>,
  fields: (keyof EditPropertyValues)[],
) => {
  fields.forEach((field) => {
    formik.setFieldTouched(field, true, false);
  });
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
  "interiorType",
  "upkeepType",
  "heatingType",
  "constructedYear",
  "numberOfFloorsCommon",
  "floorNumber",
  "description",
  ...(values.propertyType === "LAND" ? [] : []),
];

const EditForm = ({ formik, addressId, id, loading }: EditFormProps) => {
  const [showError, setShowErrors] = useState(false);
  const { authToken } = useAuthContext();
  const updateProperty = useUpdateProperty({ authToken });
  const router = useRouter();
  const isLand = formik.values.propertyType === "LAND";
  const tenYearsFromNow = new Date().getFullYear() + 10;
  const description = formik.values.description || "";

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
      toast.error("Listing id is missing.");
      return;
    }

    const errors = validateEditForm(formik.values);
    markFieldsTouched(formik, errorFields(formik.values));
    formik.setErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }

    const constructedYear = toPayloadNumber(formik.values.constructedYear);
    const values: any = {
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
      await updateProperty.mutateAsync(values);
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
          Edit listing
        </div>
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937] md:text-4xl">
            Update property details
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#64748B] md:text-base">
            Keep the listing accurate and complete. Changes are saved to the
            live property after review.
          </p>
        </div>

        <div className="mt-4">
          <SectionRow
            icon={<HomeModernIcon className="h-5 w-5" />}
            title="Listing intent"
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
            description="Choose the current category used by listing filters."
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

          <SectionRow
            icon={<MapPinIcon className="h-5 w-5" />}
            title="Location"
            description="Edit the stored address and coordinates for the listing."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                formik={formik}
                name="streetNumber"
                label="House number"
              />
              <TextField formik={formik} name="route" label="Street" />
              <TextField
                formik={formik}
                name="neighborhood"
                label="Neighborhood"
              />
              <TextField formik={formik} name="locality" label="City" />
              <TextField
                formik={formik}
                name="administrativeArea"
                label="Administrative area"
              />
              <TextField
                formik={formik}
                name="postalCode"
                label="Postal code"
              />
              <TextField formik={formik} name="latitude" label="Latitude" />
              <TextField formik={formik} name="longitude" label="Longitude" />
            </div>
          </SectionRow>

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

          {!isLand && (
            <SectionRow
              icon={<HomeModernIcon className="h-5 w-5" />}
              title="Rooms and parking"
              description="Keep the headline numbers accurate for search and comparison."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  formik={formik}
                  name="rooms"
                  label="Rooms"
                  error={showError ? (formik.errors.rooms as string) : ""}
                />
                <NumberField
                  formik={formik}
                  name="bedrooms"
                  label="Bedrooms"
                  error={showError ? (formik.errors.bedrooms as string) : ""}
                />
                <NumberField
                  formik={formik}
                  name="bathrooms"
                  label="Bathrooms"
                  error={showError ? (formik.errors.bathrooms as string) : ""}
                />
                <NumberField
                  formik={formik}
                  name="parking"
                  label="Parking places"
                  error={showError ? (formik.errors.parking as string) : ""}
                />
              </div>
            </SectionRow>
          )}

          <SectionRow
            icon={<Squares2X2Icon className="h-5 w-5" />}
            title="Dimensions"
            description={
              isLand
                ? "Land listings only need the total plot area."
                : "Use total area for the headline and add supporting spaces where relevant."
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                formik={formik}
                name="totalArea"
                label={isLand ? "Plot area" : "Total area"}
                unit="m²"
                error={showError ? (formik.errors.totalArea as string) : ""}
              />
              {!isLand && (
                <>
                  <NumberField
                    formik={formik}
                    name="livingArea"
                    label="Living area"
                    unit="m²"
                    error={
                      showError ? (formik.errors.livingArea as string) : ""
                    }
                  />
                  <NumberField
                    formik={formik}
                    name="areaOutside"
                    label="Outside area"
                    unit="m²"
                    error={
                      showError ? (formik.errors.areaOutside as string) : ""
                    }
                  />
                  <NumberField
                    formik={formik}
                    name="areaGarage"
                    label="Garage area"
                    unit="m²"
                    error={
                      showError ? (formik.errors.areaGarage as string) : ""
                    }
                  />
                  <NumberField
                    formik={formik}
                    name="volume"
                    label="Volume"
                    unit="m³"
                    error={showError ? (formik.errors.volume as string) : ""}
                  />
                </>
              )}
            </div>
          </SectionRow>

          {!isLand && (
            <>
              <SectionRow
                icon={<FireIcon className="h-5 w-5" />}
                title="Interior and condition"
                description="Update comfort and condition details that buyers scan quickly."
              >
                <div className="grid gap-6">
                  <div>
                    <p className="mb-3 text-sm font-bold text-[#1F2937]">
                      Interior type
                    </p>
                    <SingleSelectRadioButton
                      value={formik.values.interiorType}
                      options={INTERIOR_TYPES}
                      onChange={(value) =>
                        formik.setFieldValue("interiorType", value, true)
                      }
                      id="interiorType"
                    />
                    <ErrorText>
                      {showError ? (formik.errors.interiorType as string) : ""}
                    </ErrorText>
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-bold text-[#1F2937]">
                      Property condition
                    </p>
                    <SingleSelectRadioButton
                      value={formik.values.upkeepType}
                      options={UPKEEP_TYPES}
                      onChange={(value) =>
                        formik.setFieldValue("upkeepType", value, true)
                      }
                      id="upkeepType"
                    />
                    <ErrorText>
                      {showError ? (formik.errors.upkeepType as string) : ""}
                    </ErrorText>
                  </div>
                </div>
              </SectionRow>

              <SectionRow
                icon={<FireIcon className="h-5 w-5" />}
                title="Heating"
                description="Select the primary heating type used by the property."
              >
                <SingleSelectRadioButton
                  value={formik.values.heatingType}
                  options={HEATING_TYPES}
                  onChange={(value) =>
                    formik.setFieldValue("heatingType", value, true)
                  }
                  id="heatingType"
                />
                <ErrorText>
                  {showError ? (formik.errors.heatingType as string) : ""}
                </ErrorText>
              </SectionRow>

              <SectionRow
                icon={<BuildingOffice2Icon className="h-5 w-5" />}
                title="Building details"
                description="Optional details that explain the building and floor position."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField
                    formik={formik}
                    name="constructedYear"
                    label="Year built"
                    min={1900}
                    max={tenYearsFromNow}
                    error={
                      showError ? (formik.errors.constructedYear as string) : ""
                    }
                  />
                  <NumberField
                    formik={formik}
                    name="numberOfFloorsCommon"
                    label="Floors in building"
                    error={
                      showError
                        ? (formik.errors.numberOfFloorsCommon as string)
                        : ""
                    }
                  />
                  <NumberField
                    formik={formik}
                    name="floorNumber"
                    label="Property floor"
                    error={
                      showError ? (formik.errors.floorNumber as string) : ""
                    }
                  />
                </div>
              </SectionRow>
            </>
          )}

          <SectionRow
            icon={<PhotoIcon className="h-5 w-5" />}
            title="Photos"
            description="Photos are optional. If present, the first image remains the main listing image."
          >
            <PlacingPropertyImagesHandler
              initialImages={formik.values.images || []}
              onChange={(images) =>
                formik.setFieldValue("images", images, true)
              }
            />
          </SectionRow>

          <SectionRow
            icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
            title="Description"
            description="Keep the public listing copy accurate and useful for buyers."
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <label
                  className="block text-sm font-bold text-[#1F2937]"
                  htmlFor="description"
                >
                  Listing description
                </label>
                <span className="text-xs font-semibold text-[#64748B]">
                  {description.trim().length} characters
                </span>
              </div>
              <textarea
                name="description"
                id="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={description}
                placeholder="Describe the layout, condition, natural light, location and anything buyers should know."
                className="min-h-[190px] w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15"
              />
              {showError && (
                <ErrorText>{formik.errors.description as string}</ErrorText>
              )}
            </div>
          </SectionRow>
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
