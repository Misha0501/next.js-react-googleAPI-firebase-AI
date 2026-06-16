import * as z from "zod";
import { isValidDateFromString } from "@/app/lib/validations/isValidDate";
import { baseAddressSchema } from "@/app/lib/validations/shared";
import {
  CURRENCIES,
  HEATING_TYPES,
  INTERIOR_TYPES,
  LISTING_TYPES,
  UPKEEP_TYPES,
  PROPERTY_TYPES,
} from "@/app/lib/constants";
import type {
  CurrencyType,
  HeatingType,
  InteriorType,
  ListingType,
  PropertyType,
  UpkeepType,
} from "@/types";
const tenYearsFromNow = new Date();
tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);

export const listingSchema = z.object({
  listingType: z.enum(LISTING_TYPES as [ListingType, ...ListingType[]]),
  interiorType: z
    .enum(INTERIOR_TYPES as [InteriorType, ...InteriorType[]])
    .optional()
    .nullable(),
  propertyType: z
    .enum(PROPERTY_TYPES as [PropertyType, ...PropertyType[]])
    .optional()
    .nullable(),
  upkeepType: z
    .enum(UPKEEP_TYPES as [UpkeepType, ...UpkeepType[]])
    .optional()
    .nullable(),
  price: z.number().min(0),
  currency: z
    .enum(CURRENCIES as [CurrencyType, ...CurrencyType[]])
    .optional()
    .nullable(),
  address: baseAddressSchema.optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        imagePath: z.string().optional(),
        positionInListing: z.number(),
      }),
    )
    .min(0, {
      message: "There should be at least 0 images of the property",
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
          message: "Property key point title must not exceed 150 characters",
        }),
        description: z.string().max(250, {
          message:
            "Property key point description must not exceed 250 characters",
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
  heatingType: z
    .enum(HEATING_TYPES as [HeatingType, ...HeatingType[]])
    .optional()
    .nullable(),
});

export const listingSchemaPutRequest = listingSchema.extend({
  id: z.number(),
  listingType: z
    .enum(LISTING_TYPES as [ListingType, ...ListingType[]])
    .optional(),
  interiorType: z
    .enum(INTERIOR_TYPES as [InteriorType, ...InteriorType[]])
    .optional(),
  propertyType: z
    .enum(PROPERTY_TYPES as [PropertyType, ...PropertyType[]])
    .optional(),
  price: z.number().min(0).optional(),
  currency: z.enum(CURRENCIES as [CurrencyType, ...CurrencyType[]]).optional(),
  address: baseAddressSchema.extend({ id: z.number() }).optional(),
  upkeepType: z.enum(UPKEEP_TYPES as [UpkeepType, ...UpkeepType[]]).optional(),
  images: z
    .array(
      z.object({
        id: z.number().optional(),
        url: z.string(),
        imagePath: z.string().nullable().optional(),
        positionInListing: z.number(),
      }),
    )
    .optional()
    .nullable(),
});

const searchParamSchema = z.string().array();
const LISTING_SORT_OPTIONS = [
  "createdAtDesc",
  "createdAtAsc",
  "priceDesc",
  "priceAsc",
];

// Extracts first element and converts to number; used for single numeric query params.
const numericParam = (min: number, max: number) =>
  searchParamSchema
    .max(1)
    .transform((arr) => Number(arr[0] ?? ""))
    .pipe(z.number().min(min).max(max))
    .optional();

// Extracts first element as string; used for single string query params.
const stringParam = () =>
  searchParamSchema
    .max(1)
    .transform((arr) => arr[0] ?? "")
    .pipe(z.string())
    .optional();

export const listingsSearchParamSchema = z.object({
  page: numericParam(0, 1000000),
  pageSize: numericParam(0, 100),
  sortBy: stringParam().superRefine((value, ctx) => {
    if (value !== undefined && !LISTING_SORT_OPTIONS.includes(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid sort input: ${value}. Allowed values: ${LISTING_SORT_OPTIONS}`,
      });
    }
  }),
  locality: stringParam(),
  heatingType: searchParamSchema
    .min(1)
    .max(HEATING_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => HEATING_TYPES.includes(el as HeatingType)),
      {
        message: `Invalid heating type input. Allowed values: ${HEATING_TYPES}`,
      },
    )
    .optional(),
  currencyType: searchParamSchema
    .min(1)
    .max(CURRENCIES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => CURRENCIES.includes(el as CurrencyType)),
      { message: `Invalid currency input. Allowed values: ${CURRENCIES}` },
    )
    .optional(),
  listingType: searchParamSchema
    .min(1)
    .max(LISTING_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => LISTING_TYPES.includes(el as ListingType)),
      { message: `Invalid offer type input. Allowed values: ${LISTING_TYPES}` },
    )
    .optional(),
  interiorType: searchParamSchema
    .min(1)
    .max(INTERIOR_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) =>
          INTERIOR_TYPES.includes(el as InteriorType),
        ),
      {
        message: `Invalid interior type input. Allowed values: ${INTERIOR_TYPES}`,
      },
    )
    .optional(),
  propertyType: searchParamSchema
    .min(1)
    .max(PROPERTY_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) =>
          PROPERTY_TYPES.includes(el as PropertyType),
        ),
      {
        message: `Invalid interior type input. Allowed values: ${PROPERTY_TYPES}`,
      },
    )
    .optional(),
  upkeepType: searchParamSchema
    .min(1)
    .max(UPKEEP_TYPES.length)
    .refine(
      (userInputArray) =>
        userInputArray.every((el) => UPKEEP_TYPES.includes(el as UpkeepType)),
      { message: `Invalid upkeep type input. Allowed values: ${UPKEEP_TYPES}` },
    )
    .optional(),
  priceMin: numericParam(0, 1000000000),
  priceMax: numericParam(0, 1000000000),
  areaTotalMin: numericParam(0, 1000000),
  areaTotalMax: numericParam(0, 1000000),
  areaLivingMin: numericParam(0, 1000000),
  areaLivingMax: numericParam(0, 1000000),
  areaLandMin: numericParam(0, 1000000),
  areaLandMax: numericParam(0, 1000000),
  areaOutsideMin: numericParam(0, 1000000),
  areaOutsideMax: numericParam(0, 1000000),
  roomsMin: numericParam(0, 1000000),
  roomsMax: numericParam(0, 1000000),
  bathroomsMin: numericParam(0, 1000000),
  bathroomsMax: numericParam(0, 1000000),
  bedroomsMin: numericParam(0, 1000000),
  bedroomsMax: numericParam(0, 1000000),
  parkingMin: numericParam(0, 1000000),
  parkingMax: numericParam(0, 1000000),
  listedSince: numericParam(0, 1000000),
  constructedYearMin: searchParamSchema
    .max(1)
    .transform((arr) => arr[0] ?? "")
    .pipe(
      z.string().refine((v) => isValidDateFromString(v), {
        message: "Invalid plain date, should be the next format 2023-12-31",
      }),
    )
    .optional(),
  constructedYearMax: searchParamSchema
    .max(1)
    .transform((arr) => arr[0] ?? "")
    .pipe(
      z.string().refine((v) => isValidDateFromString(v), {
        message: "Invalid plain date, should be the next format 2023-12-31",
      }),
    )
    .optional(),
});

export type ListingSearchParams = z.infer<typeof listingsSearchParamSchema>;
