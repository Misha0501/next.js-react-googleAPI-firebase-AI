import {NextRequest, NextResponse} from 'next/server'
import {ApplicationUser} from '@prisma/client'
import {listingSchema, listingsSearchParamSchema} from "@/app/lib/validations/listing";
import {z} from "zod"
import {ResponseError} from "@/classes/ResponseError";
import {getApplicationUserServer} from "@/app/lib/getApplicationUserServer";
import {valuesFromSearchParams} from "@/app/lib/validations/valuesFromSearchParams";
import {
    prismaQueryConditionsFromArray,
    prismaQueryConditionsFromMinMaxValidDateStringValue,
    prismaQueryConditionsFromMinMaxValue
} from "@/app/lib/db";
import {prisma} from "@/app/lib/db/client";


/**
 * POST Route to post new listing.
 * @param req
 * @param route
 * @constructor
 */
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url)

        const values = valuesFromSearchParams(url.searchParams)

        const parsedValues = listingsSearchParamSchema.parse(values)
        let {
            page,
            limit,
            locality,
            heatingType,
            listingType,
            interiorType,
            propertyTypeId,
            upkeepType,
            areaTotalMin,
            areaTotalMax,
            areaLivingMin,
            areaLivingMax,
            areaLandMin,
            areaLandMax,
            areaOutsideMin,
            areaOutsideMax,
            roomsMin,
            roomsMax,
            bathroomsMin,
            bathroomsMax,
            bedroomsMin,
            bedroomsMax,
            parkingMin,
            parkingMax,
            constructedYearMin,
            constructedYearMax
        } = parsedValues;

        // Prisma where object that that will be field with conditions
        let prismaQueryConditions = {
            AND: [],
        };

        let localityWhereObj = prismaQueryConditionsFromArray(locality, "locality");
        let heatingTypeWhereObj = prismaQueryConditionsFromArray(heatingType, "heatingType");
        let listingTypeWhereObj = prismaQueryConditionsFromArray(listingType, "listingType");
        let interiorTypeWhereObj = prismaQueryConditionsFromArray(interiorType, "interiorType");
        let propertyTypeIdWhereObj = prismaQueryConditionsFromArray(propertyTypeId, "propertyTypeId");
        let upkeepTypeWhereObj = prismaQueryConditionsFromArray(upkeepType, "upkeepType");
        let areaTotalWhereObj = prismaQueryConditionsFromMinMaxValue(areaTotalMin, areaTotalMax, "areaTotal");
        let areaLivingWhereObj = prismaQueryConditionsFromMinMaxValue(areaLivingMin, areaLivingMax, "areaLiving");
        let areaLandWhereObj = prismaQueryConditionsFromMinMaxValue(areaLandMin, areaLandMax, "areaLand");
        let areaOutsideWhereObj = prismaQueryConditionsFromMinMaxValue(areaOutsideMin, areaOutsideMax, "areaOutside");
        let roomsWhereObj = prismaQueryConditionsFromMinMaxValue(roomsMin, roomsMax, "rooms");
        let bathroomsWhereObj = prismaQueryConditionsFromMinMaxValue(bathroomsMin, bathroomsMax, "bathrooms");
        let bedroomsWhereObj = prismaQueryConditionsFromMinMaxValue(bedroomsMin, bedroomsMax, "bedrooms");
        let parkingWhereObj = prismaQueryConditionsFromMinMaxValue(parkingMin, parkingMax, "parking");
        let constructedYearWhereObj = prismaQueryConditionsFromMinMaxValidDateStringValue(constructedYearMin, constructedYearMax, "constructedYear");

        prismaQueryConditions.AND.push(
            localityWhereObj,
            heatingTypeWhereObj,
            listingTypeWhereObj,
            interiorTypeWhereObj,
            propertyTypeIdWhereObj,
            upkeepTypeWhereObj,
            areaTotalWhereObj,
            areaLivingWhereObj,
            areaLandWhereObj,
            areaOutsideWhereObj,
            roomsWhereObj,
            bathroomsWhereObj,
            bedroomsWhereObj,
            parkingWhereObj,
            constructedYearWhereObj)

        const listings = await prisma.listing.findMany({
            take: 25,
            where: {
                ...prismaQueryConditions
            }
        });

        return NextResponse.json(listings)
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        if (error instanceof ResponseError) {
            return new Response(error.message, {status: error.status})
        }

        if (error.errorInfo && error.errorInfo.code) {
            return new Response('Firebase ID token is invalid or it has expired. Get a fresh ID token and try again.', {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}


/**
 * POST Route to post new listing.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
    try {
        const applicationUser: ApplicationUser = await getApplicationUserServer()

        const parsedValues = listingSchema.parse(await req.json());
        const {
            postalCode,
            localityId,
            listingType,
            interiorType,
            propertyTypeId,
            upkeepType,
            images,
            description,
            areaTotal,
            areaLiving,
            areaLand,
            volume,
            areaOutside,
            areaGarage,
            streetName,
            houseNumber,
            longitude,
            latitude,
            rooms,
            bathrooms,
            bedrooms,
            parking,
            constructedYear,
            floorNumber,
            numberOfFloorsProperty,
            numberOfFloorsCommon,
            heatingType
        } = parsedValues


        const listing = await prisma.listing.create({
            data: {
                applicationUserId: applicationUser.id,
                postalCode,
                localityId,
                listingType,
                interiorType,
                propertyTypeId,
                upkeepType,
                description,
                areaTotal,
                areaLiving,
                areaLand,
                volume,
                areaOutside,
                areaGarage,
                streetName,
                houseNumber,
                longitude,
                latitude,
                rooms,
                bathrooms,
                bedrooms,
                parking,
                constructedYear,
                floorNumber,
                numberOfFloorsProperty,
                numberOfFloorsCommon,
                heatingType,
                ListingImage: {
                    create: [
                        ...images
                    ]
                }
            },
        })

        return NextResponse.json(listing)
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response(error.message, {status: 422})
        }

        if (error instanceof ResponseError) {
            return new Response(error.message, {status: error.status})
        }

        if (error.errorInfo && error.errorInfo.code) {
            return new Response('Firebase ID token is invalid or it has expired. Get a fresh ID token and try again.', {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}
