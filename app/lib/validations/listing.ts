import * as z from "zod";
import { isValidDateFromString } from "@/app/lib/validations/isValidDate";
import {
  CURRENCIES,
  HEATING_TYPES,
  INTERIOR_TYPES,
  LISTING_TYPES,
  UPKEEP_TYPES,
    PROPERTY_TYPES
} from "@/app/Constants";

const tenYearsFromNow = new Date();
tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);

export const listingSchema = z.object({
  listingType: z.enum(LISTING_TYPES),
  interiorType: z.enum(INTERIOR_TYPES),
  propertyType: z.enum(PROPERTY_TYPES),
  upkeepType: z.enum(UPKEEP_TYPES),
  price: z.number().min(0),
  currency: z.enum(CURRENCIES).optional().nullable(),
  address: z
    .object({
      streetNumber: z.string().optional(),
      route: z.string().optional(),
      locality: z.string().optional(),
      postalCode: z.string().optional(),
      neighborhood: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      administrativeAreaLevelOne: z.string().optional(),
      showExactLocation: z.boolean().optional(),
    })
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        positionInListing: z.number(),
      }),
    )
    .min(0, {
      message: "There should be at least 3 images of the property",
    })
    .max(30, {
      message: "There can be max 30 images of the property",
    })
    .optional()
    .nullable(),
  description: z
    .string()
    .max(10000, {
      message: "Description must not exceed 10000 characters",
    })
    .optional(),
  listingDescriptionKeyPoints: z
    .array(
      z.object({
        title: z.string().max(150, {
          message: "Listing's key point title must not exceed 150 characters",
        }),
        description: z.string().max(250, {
          message:
            "Listing's key point description must not exceed 250 characters",
        }),
      }),
    )
    .optional()
    .nullable(),
  areaTotal: z
    .number()
    .max(1000000, {
      message: "AreaTotal can not exceed 1000000",
    })
    .optional()
    .nullable(),
  areaLiving: z.number().max(1000000).optional().nullable(),
  areaLand: z.number().max(1000000).optional().nullable(),
  volume: z.number().max(1000000).optional().nullable(),
  areaOutside: z.number().max(1000000).optional().nullable(),
  areaGarage: z.number().max(1000000).optional().nullable(),
  streetName: z.string().optional().nullable(),
  houseNumber: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
  latitude: z.string().optional().nullable(),
  rooms: z
    .number()
    .max(99, {
      message: "Amount of rooms can not exceed 99",
    })
    .optional()
    .nullable(),
  bathrooms: z
    .number()
    .max(99, {
      message: "Amount of bathrooms can not exceed 99",
    })
    .optional()
    .nullable(),
  bedrooms: z
    .number()
    .max(99, {
      message: "Amount of bedrooms can not exceed 99",
    })
    .optional()
    .nullable(),
  parking: z
    .number()
    .max(99, {
      message: "Amount of parkings can not exceed 99",
    })
    .optional()
    .nullable(),
  constructedYear: z.coerce
    .date()
    .min(new Date("1900-01-01"), {
      message: "Constructed year can't be older than 1900 year.",
    })
    .max(tenYearsFromNow, {
      message: "Constructed year can't be more than 10 years from now.",
    })
    .optional()
    .nullable(),
  floorNumber: z.number().optional().nullable(),
  numberOfFloorsProperty: z.number().optional().nullable(),
  numberOfFloorsCommon: z.number().optional().nullable(),
  heatingType: z.enum(HEATING_TYPES).optional(),
});

export const listingSchemaPutRequest = listingSchema.extend({
  id: z.number(),
  listingType: z.enum(LISTING_TYPES).optional(),
  interiorType: z.enum(INTERIOR_TYPES).optional(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  price: z.number().min(0).optional(),
  currency: z.enum(CURRENCIES).optional(),
  address: z
    .object({
      id: z.number(),
      streetNumber: z.string().optional(),
      route: z.string().optional(),
      locality: z.string().optional(),
      postalCode: z.string().optional(),
      neighborhood: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      showExactLocation: z.boolean().optional(),
      administrativeAreaLevelOne: z.string().optional(),
    })
    .optional(),
  upkeepType: z.enum(UPKEEP_TYPES).optional(),
  images: z
    .array(
      z.object({
        id: z.number().optional(),
        url: z.string(),
        positionInListing: z.number(),
      }),
    )
    .optional()
    .nullable(),
});

const searchParamSchema = z.string().array();

export const listingsSearchParamSchema = z.object({
  page: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  pageSize: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(100))
    .optional(),
  locality: searchParamSchema.pipe(z.coerce.string()).optional(),
  heatingType: searchParamSchema
    .min(1)
    .max(HEATING_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => HEATING_TYPES.includes(el)),
      (val) => ({
        message: `Invalid heating type input: ${val}. Allowed values: ${HEATING_TYPES}`,
      }),
    )
    .optional(),
    currencyType: searchParamSchema
        .min(1)
        .max(CURRENCIES.length)
        .refine(
            (userInputArray) =>
                userInputArray.every((el) => CURRENCIES.includes(el)),
            (val) => ({
                message: `Invalid listing type input: ${val}. Allowed values: ${CURRENCIES}`,
            }),
        )
        .optional(),
  listingType: searchParamSchema
    .min(1)
    .max(LISTING_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => LISTING_TYPES.includes(el)),
      (val) => ({
        message: `Invalid listing type input: ${val}. Allowed values: ${LISTING_TYPES}`,
      }),
    )
    .optional(),
  interiorType: searchParamSchema
    .min(1)
    .max(INTERIOR_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => INTERIOR_TYPES.includes(el)),
      (val) => ({
        message: `Invalid interior type input: ${val}. Allowed values: ${INTERIOR_TYPES}`,
      }),
    )
    .optional(),
  propertyType: searchParamSchema
      .min(1)
      .max(PROPERTY_TYPES.length)
      .refine(
          (userInputArray) =>
              userInputArray.every((el) => PROPERTY_TYPES.includes(el)),
          (val) => ({
              message: `Invalid interior type input: ${val}. Allowed values: ${PROPERTY_TYPES}`,
          }),
      )
      .optional(),
  upkeepType: searchParamSchema
    .min(1)
    .max(2)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => UPKEEP_TYPES.includes(el)),
      (val) => ({
        message: `Invalid upkeep type input: ${val}. Allowed values: ${UPKEEP_TYPES}`,
      }),
    )
    .optional(),
    priceMin: searchParamSchema
        .max(1)
        .pipe(z.coerce.number().min(0).max(1000000000))
        .optional(),
    priceMax: searchParamSchema
        .max(1)
        .pipe(z.coerce.number().min(0).max(1000000000))
        .optional(),
  areaTotalMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  areaTotalMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  areaLivingMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  areaLivingMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  areaLandMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  areaLandMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  areaOutsideMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  areaOutsideMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  roomsMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  roomsMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  bathroomsMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  bathroomsMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  bedroomsMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  bedroomsMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  parkingMin: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  parkingMax: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  listedSince: searchParamSchema
    .max(1)
    .pipe(z.coerce.number().min(0).max(1000000))
    .optional(),
  constructedYearMin: searchParamSchema
    .max(1)
    .pipe(
      z.coerce.string().refine(
        (v) => isValidDateFromString(v),
        (val) => ({
          message: `Invalid plain date: ${val}, should be the next format 2023-12-31`,
        }),
      ),
    )
    .optional(),
  constructedYearMax: searchParamSchema
    .max(1)
    .pipe(
      z.coerce.string().refine(
        (v) => isValidDateFromString(v),
        (val) => ({
          message: `Invalid plain date: ${val}, should be the next format 2023-12-31`,
        }),
      ),
    )
    .optional(),
});
