import { FormikProps } from "formik";
import { ListingImage } from "@/types";

export type PlacementFormValues = {
  listingType: string;
  propertyType: string;
  address: string;
  streetNumber: string;
  route: string;
  locality: string;
  neighborhood: string;
  administrativeArea: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  currency: string;
  price: number | string;
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
  buildingType?: string;
  characteristics?: string;
  description?: string;
  images: ListingImage[];
};

export type PlacementErrors = Partial<
  Record<keyof PlacementFormValues, string>
>;

const currentYear = new Date().getFullYear();

const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === "";

const toNumber = (value: unknown) => {
  if (isEmpty(value)) return null;

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

const validateOptionalNonNegative = (
  errors: PlacementErrors,
  values: PlacementFormValues,
  field: keyof PlacementFormValues,
  label: string,
) => {
  if (!isNonNegative(values[field])) {
    errors[field] = `${label} cannot be negative`;
  }
};

export const getGeneralInfoFields = (): (keyof PlacementFormValues)[] => [
  "listingType",
  "propertyType",
  "locality",
  "price",
];

export const getMoreDetailsFields = (
  values: PlacementFormValues,
): (keyof PlacementFormValues)[] => {
  const fields: (keyof PlacementFormValues)[] = ["totalArea"];

  if (values.propertyType !== "LAND") {
    fields.push(
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
    );
  }

  return fields;
};

export const getDescriptionFields = (): (keyof PlacementFormValues)[] => [
  "description",
];

export const getAllPlacementFields = (values: PlacementFormValues) => [
  ...getGeneralInfoFields(),
  ...getMoreDetailsFields(values),
  ...getDescriptionFields(),
];

export const validateGeneralInfo = (values: PlacementFormValues) => {
  const errors: PlacementErrors = {};

  if (!values.listingType)
    errors.listingType = "Choose if this is for sale or rent";
  if (!values.propertyType) errors.propertyType = "Select a property type";
  if (!values.locality) {
    errors.locality = "Select an address from the suggestions";
  }
  if (!isPositive(values.price)) {
    errors.price = "Enter a price greater than 0";
  }

  return errors;
};

export const validateMoreDetails = (values: PlacementFormValues) => {
  const errors: PlacementErrors = {};
  const isLand = values.propertyType === "LAND";

  if (!isPositive(values.totalArea)) {
    errors.totalArea = "Enter the total area";
  }

  validateOptionalNonNegative(errors, values, "rooms", "Rooms");
  validateOptionalNonNegative(errors, values, "bedrooms", "Bedrooms");
  validateOptionalNonNegative(errors, values, "bathrooms", "Bathrooms");
  validateOptionalNonNegative(errors, values, "parking", "Parking places");
  validateOptionalNonNegative(errors, values, "livingArea", "Living area");
  validateOptionalNonNegative(errors, values, "areaOutside", "Outside area");
  validateOptionalNonNegative(errors, values, "areaGarage", "Garage area");
  validateOptionalNonNegative(errors, values, "volume", "Volume");
  validateOptionalNonNegative(errors, values, "numberOfFloorsCommon", "Floors");
  validateOptionalNonNegative(errors, values, "floorNumber", "Floor number");

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

  return errors;
};

export const validateDescriptionAndImages = (values: PlacementFormValues) => {
  const errors: PlacementErrors = {};
  const description = values.description?.trim() || "";

  if (!description) {
    errors.description = "Add a property description";
  } else if (description.length < 30) {
    errors.description = "Write at least 30 characters";
  }

  return errors;
};

export const validatePlacementValues = (values: PlacementFormValues) => ({
  ...validateGeneralInfo(values),
  ...validateMoreDetails(values),
  ...validateDescriptionAndImages(values),
});

export const applyStepErrors = (
  formik: FormikProps<any>,
  fields: (keyof PlacementFormValues)[],
  errors: PlacementErrors,
) => {
  const nextErrors = { ...formik.errors };

  fields.forEach((field) => {
    delete nextErrors[field];
    formik.setFieldTouched(field, true, false);
  });

  formik.setErrors({
    ...nextErrors,
    ...errors,
  });
};
