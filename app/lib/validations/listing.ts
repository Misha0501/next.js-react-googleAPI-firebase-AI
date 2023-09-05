import * as z from "zod"
import {isValidDateFromString} from "@/app/lib/validations/isValidDate";
import {ZodTypeAny} from "zod";

const tenYearsFromNow = new Date();
tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);

const HEATING_TYPE_VALID_VALUES = ['BOILER', 'CENTRAL'];
const LISTING_TYPE_VALID_VALUES = ['RENT', 'SELL'];
const INTERIOR_TYPE_VALID_VALUES = ['FURNISHED', 'UNFURNISHED'];
const UPKEEP_TYPE_VALID_VALUES = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'];
const CURRENCY = ['EUR', 'USD'];

export const listingSchema = z.object({
    listingType: z.enum(LISTING_TYPE_VALID_VALUES),
    interiorType: z.enum(INTERIOR_TYPE_VALID_VALUES),
    propertyTypeId: z.number(),
    upkeepType: z.enum(UPKEEP_TYPE_VALID_VALUES),
    price: z.number().min(0),
    currency: z.enum(CURRENCY),
    address: z.object(
        {
            streetNumber: z.string().optional(),
            route: z.string().optional(),
            locality: z.string().optional(),
            postalCode: z.string().optional(),
            neighborhood: z.string().optional(),
            latitude: z.string().optional(),
            longitude: z.string().optional(),
            administrativeAreaLevelOne: z.string().optional(),
            showExactLocation: z.boolean().optional()
        }
    ),
    images: z
        .array(
            z.object({
                url: z.string(),
                positionInListing: z.number()
            })
        ).min(3, {
            message: "There should be at least 3 images of the property"
        }).max(30, {
            message: "There can be max 30 images of the property"
        })
        .optional()
        .nullable(),
    description: z.string().max(10000, {
        message: "Description must not exceed 10000 characters",
    }).optional(),
    listingDescriptionKeyPoints: z
        .array(
            z.object({
                title: z.string().max(150, {
                    message: "Listing's key point title must not exceed 150 characters",
                }),
                description: z.string().max(250, {
                    message: "Listing's key point description must not exceed 250 characters",
                }),
            })
        )
        .optional()
        .nullable(),
    areaTotal: z.number().max(1000000, {
        message: "AreaTotal can not exceed 1000000",
    }),
    areaLiving: z.number().max(1000000).optional(),
    areaLand: z.number().max(1000000).optional(),
    volume: z.number().max(1000000).optional(),
    areaOutside: z.number().max(1000000).optional(),
    areaGarage: z.number().max(1000000).optional(),
    streetName: z.string().optional(),
    houseNumber: z.string().optional(),
    longitude: z.string().optional(),
    latitude: z.string().optional(),
    rooms: z.number().max(99, {
        message: "Amount of rooms can not exceed 99",
    }).optional(),
    bathrooms: z.number().max(99, {
        message: "Amount of bathrooms can not exceed 99",
    }).optional(),
    bedrooms: z.number().max(99, {
        message: "Amount of bedrooms can not exceed 99",
    }).optional(),
    parking: z.number().max(99, {
        message: "Amount of parkings can not exceed 99",
    }).optional(),
    constructedYear: z.coerce.date().min(new Date("1900-01-01"),
        {message: "Constructed year can't be older than 1900 year."})
        .max(tenYearsFromNow, {message: "Constructed year can't be more than 10 years from now."})
        .optional(),
    floorNumber: z.number().optional(),
    numberOfFloorsProperty: z.number().optional(),
    numberOfFloorsCommon: z.number().optional(),
    heatingType: z.enum(HEATING_TYPE_VALID_VALUES).optional(),
})

export const listingSchemaPutRequest = listingSchema.extend({
    id: z.number(),
    listingType: z.enum(LISTING_TYPE_VALID_VALUES).optional(),
    interiorType: z.enum(INTERIOR_TYPE_VALID_VALUES).optional(),
    propertyTypeId: z.number().optional(),
    price: z.number().min(0).optional(),
    currency: z.enum(CURRENCY).optional(),
    address: z.object(
        {
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
        }
    ).optional(),
    upkeepType: z.enum(UPKEEP_TYPE_VALID_VALUES).optional(),
    images: z
        .array(
            z.object({
                id: z.number().optional(),
                url: z.string(),
                positionInListing: z.number()
            })
        ).optional()
        .nullable(),
})

const searchParamSchema = z.string().array()

export const listingsSearchParamSchema = z.object({
    page: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    pageSize: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(100)
    ).optional(),
    locality: searchParamSchema.pipe(z.coerce.string()).optional(),
    heatingType: searchParamSchema.min(1).max(2).refine(
        userInputArray => userInputArray.every(el => HEATING_TYPE_VALID_VALUES.includes(el)),
        val => ({message: `Invalid heating type input: ${val}. Allowed values: ${HEATING_TYPE_VALID_VALUES}`})
    ).optional(),
    listingType: searchParamSchema.min(1).max(2).refine(
        userInputArray => userInputArray.every(el => LISTING_TYPE_VALID_VALUES.includes(el)),
        val => ({message: `Invalid listing type input: ${val}. Allowed values: ${LISTING_TYPE_VALID_VALUES}`})
    ).optional(),
    interiorType: searchParamSchema.min(1).max(2).refine(
        userInputArray => userInputArray.every(el => INTERIOR_TYPE_VALID_VALUES.includes(el)),
        val => ({message: `Invalid interior type input: ${val}. Allowed values: ${INTERIOR_TYPE_VALID_VALUES}`})
    ).optional(),
    propertyTypeId: searchParamSchema.min(1).max(8).optional(),
    upkeepType: searchParamSchema.min(1).max(2).refine(
        userInputArray => userInputArray.every(el => UPKEEP_TYPE_VALID_VALUES.includes(el)),
        val => ({message: `Invalid upkeep type input: ${val}. Allowed values: ${UPKEEP_TYPE_VALID_VALUES}`})
    ).optional(),
    areaTotalMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    areaTotalMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    areaLivingMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    areaLivingMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    areaLandMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    areaLandMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    areaOutsideMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    areaOutsideMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    roomsMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    roomsMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    bathroomsMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    bathroomsMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    bedroomsMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    bedroomsMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    parkingMin: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    parkingMax: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    listedSince: searchParamSchema.max(1).pipe(
        z.coerce.number().min(0).max(1000000)
    ).optional(),
    constructedYearMin: searchParamSchema.max(1).pipe(
        z.coerce.string().refine(
            v => isValidDateFromString(v),
            val => ({message: `Invalid plain date: ${val}, should be the next format 2023-12-31`}),
        ),
    ).optional(),
    constructedYearMax: searchParamSchema.max(1).pipe(
        z.coerce.string().refine(
            v => isValidDateFromString(v),
            val => ({message: `Invalid plain date: ${val}, should be the next format 2023-12-31`}),
        ),
    ).optional()
})




