import * as z from "zod";
import {CURRENCIES, HEATING_TYPES, INTERIOR_TYPES, LISTING_TYPES, PROPERTY_TYPES, UPKEEP_TYPES} from "../constants";

export const openAISchema = z.object({
  listingType: z.enum(LISTING_TYPES as any).optional().nullable(),
  interiorType: z.enum(INTERIOR_TYPES as any).optional().nullable(),
  propertyType: z.enum(PROPERTY_TYPES as any).optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  currency: z.enum(CURRENCIES as any).optional().nullable(),
  address: z
    .object({
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
  upkeepType: z.enum(UPKEEP_TYPES as any).optional().nullable(),
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
  floorNumber: z.number().optional().nullable(),
  numberOfFloorsProperty: z.number().optional().nullable(),
  numberOfFloorsCommon: z.number().optional().nullable(),
  heatingType: z.enum(HEATING_TYPES as any).optional().nullable(),
});