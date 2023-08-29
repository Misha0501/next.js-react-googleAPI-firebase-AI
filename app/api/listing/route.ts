import {NextRequest, NextResponse} from 'next/server'
import {ApplicationUser} from '@prisma/client'
import {
    listingSchema,
    listingSchemaDeleteRequest,
    listingSchemaPutRequest,
    listingsSearchParamSchema
} from "@/app/lib/validations/listing";
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
            pageSize,
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

        const localityWhereObj = prismaQueryConditionsFromArray(locality, "locality");
        const heatingTypeWhereObj = prismaQueryConditionsFromArray(heatingType, "heatingType");
        const listingTypeWhereObj = prismaQueryConditionsFromArray(listingType, "listingType");
        const interiorTypeWhereObj = prismaQueryConditionsFromArray(interiorType, "interiorType");
        const propertyTypeIdWhereObj = prismaQueryConditionsFromArray(propertyTypeId, "propertyTypeId");
        const upkeepTypeWhereObj = prismaQueryConditionsFromArray(upkeepType, "upkeepType");
        const areaTotalWhereObj = prismaQueryConditionsFromMinMaxValue(areaTotalMin, areaTotalMax, "areaTotal");
        const areaLivingWhereObj = prismaQueryConditionsFromMinMaxValue(areaLivingMin, areaLivingMax, "areaLiving");
        const areaLandWhereObj = prismaQueryConditionsFromMinMaxValue(areaLandMin, areaLandMax, "areaLand");
        const areaOutsideWhereObj = prismaQueryConditionsFromMinMaxValue(areaOutsideMin, areaOutsideMax, "areaOutside");
        const roomsWhereObj = prismaQueryConditionsFromMinMaxValue(roomsMin, roomsMax, "rooms");
        const bathroomsWhereObj = prismaQueryConditionsFromMinMaxValue(bathroomsMin, bathroomsMax, "bathrooms");
        const bedroomsWhereObj = prismaQueryConditionsFromMinMaxValue(bedroomsMin, bedroomsMax, "bedrooms");
        const parkingWhereObj = prismaQueryConditionsFromMinMaxValue(parkingMin, parkingMax, "parking");
        const constructedYearWhereObj = prismaQueryConditionsFromMinMaxValidDateStringValue(constructedYearMin, constructedYearMax, "constructedYear");

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

        // If page or pageSize are not define, use standard values
        page = page ? page : 1;
        pageSize = pageSize ? pageSize : 25;

        const offsetRecords = (page - 1) * pageSize

        const totalRecordsCount = await prisma.listing.count();

        // Get listing that weren't deleted and that match the search criteria
        const listings = await prisma.listing.findMany({
            skip: offsetRecords,
            take: pageSize,
            where: {
                deleted: null,
                ...prismaQueryConditions
            }
        });

        return NextResponse.json({page, pageSize, total: totalRecordsCount, results: listings})
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

/**
 * PUT Route to update listing.
 * @param req
 * @constructor
 */
export async function PUT(req: Request) {
    try {
        const applicationUser: ApplicationUser = await getApplicationUserServer()
        const parsedValues = listingSchemaPutRequest.parse(await req.json());
        const {
            id,
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

        const listing = await prisma.listing.findUnique({
            where: {
                id,
            },
        })
        if(!listing) throw new ResponseError("Listing with provided id wasn't found.", 404)

        const applicationUserId = applicationUser.id;

        if(applicationUserId !== listing.applicationUserId) throw new ResponseError("You aren't allowed to changed this property", 401)

        const updatedListing = await prisma.listing.update({
            where: {
                id
            },
            data: {
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
            },
        })


        return NextResponse.json(updatedListing)
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
 * DELETE Route to delete a listing.
 * @param req
 * @constructor
 */
export async function DELETE(req: Request) {
    try {
        const applicationUser: ApplicationUser = await getApplicationUserServer();
        const parsedValues = listingSchemaDeleteRequest.parse(await req.json());
        const { id } = parsedValues;

        const applicationUserId = applicationUser.id;
        const listing = await prisma.listing.findUnique({
            where: { id }
        })

        if(!listing) throw new ResponseError("Listing with provided id wasn't found.", 404)

        if(applicationUserId !== listing.applicationUserId) throw new ResponseError("You aren't allowed to changed this property", 401)


        const deleteListingImages = prisma.listingImage.deleteMany({
            where: {
                listingId: id,
            },
        })

        const deleteListingPrices = prisma.listingImage.deleteMany({
            where: {
                listingId: id,
            },
        })

        const deleteListing = prisma.listing.delete({
            where: { id }
        })

        const transaction = await prisma.$transaction([deleteListingImages, deleteListingPrices, deleteListing])

        return NextResponse.json(transaction[2])
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
