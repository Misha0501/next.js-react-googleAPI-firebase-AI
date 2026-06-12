import * as z from "zod";
import {
    CURRENCIES,
    HEATING_TYPES,
    INTERIOR_TYPES,
    LISTING_TYPES,
    PROPERTY_TYPES,
    UPKEEP_TYPES
} from "../constants";

export const savedFiltersSchema = z.object({
    locality: z.string().optional(),
    heatingType: z.enum(HEATING_TYPES as any).array().optional(),
    listingType: z.enum(LISTING_TYPES as any).optional(),
    currencyType: z.enum(CURRENCIES as any).array().optional(),
    interiorType: z.enum(INTERIOR_TYPES as any).array().optional(),
    propertyType: z.enum(PROPERTY_TYPES as any).array().optional(),
    upkeepType: z.enum(UPKEEP_TYPES as any).optional(),
    priceMin: z.coerce.number().min(0).max(1000000000).optional(),
    priceMax: z.coerce.number().min(0).max(1000000000).optional(),
    areaTotalMin: z.coerce.number().min(0).max(1000000).optional(),
    areaTotalMax: z.coerce.number().min(0).max(1000000).optional(),
    areaLivingMin: z.coerce.number().min(0).max(1000000).optional(),
    areaLivingMax: z.coerce.number().min(0).max(1000000).optional(),
    roomsMin: z.coerce.number().min(0).max(1000000).optional(),
    roomsMax: z.coerce.number().min(0).max(1000000).optional(),
    bathroomsMin: z.coerce.number().min(0).max(1000000).optional(),
    bathroomsMax: z.coerce.number().min(0).max(1000000).optional(),
    bedroomsMin: z.coerce.number().min(0).max(1000000).optional(),
    bedroomsMax: z.coerce.number().min(0).max(1000000).optional(),
    constructedYearMin: z.coerce.string().optional(),
    constructedYearMax: z.coerce.string().optional(),
});
