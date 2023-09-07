import {NextRequest, NextResponse} from 'next/server'
import {ApplicationUser} from '@prisma/client'
import {listingSchema, listingSchemaPutRequest, listingsSearchParamSchema} from "@/app/lib/validations/listing";
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
import {getApplicationUserCompanyId} from "@/app/lib/listing/getApplicationUserCompanyId";
import {userAllowedManipulateListing} from "@/app/lib/listing/userAllowedManipulateListing";


/**
 * GET Route to retrieve listings.
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
            constructedYearMax,
            listedSince
        } = parsedValues;

        // Prisma where object that that will be field with conditions
        let prismaQueryConditions = {
            AND: [],
        };

        const localityWhereObj = prismaQueryConditionsFromArray(locality, "locality");
        const heatingTypeWhereObj = prismaQueryConditionsFromArray(heatingType, "heatingType");
        const listingTypeWhereObj = prismaQueryConditionsFromArray(listingType, "listingType");
        const interiorTypeWhereObj = prismaQueryConditionsFromArray(interiorType, "interiorType");
        const propertyTypeIdWhereObj = prismaQueryConditionsFromArray(propertyTypeId, "propertyTypeId", true);
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

        // set listed since
        const now = new Date();
        if (listedSince) prismaQueryConditions['createdAt'] = {gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - listedSince)}

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
            constructedYearWhereObj,
        )

        // If page or pageSize are not define, use standard values
        page = page ? page : 1;
        pageSize = pageSize ? pageSize : 25;

        const offsetRecords = (page - 1) * pageSize

        const totalRecordsCount = await prisma.listing.count({
            where: {
                ...prismaQueryConditions,
                deleted: null,
            }
        });

        // Get listing that weren't deleted and that match the search criteria
        const listings = await prisma.listing.findMany({
            skip: offsetRecords,
            take: pageSize,
            where: {
                deleted: null,
                ...prismaQueryConditions
            },
            include: {
                ListingImage: true,
                Address: true,
                ListingPrice: true,
            },
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
            return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', {status: 400})
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
        const applicationUser: ApplicationUser = await getApplicationUserServer(true);

        const parsedValues = listingSchema.parse(await req.json());
        const {
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
            heatingType,
            address,
            price,
            currency
        } = parsedValues

        // Get user's company id
        let companyId = getApplicationUserCompanyId(applicationUser);

        const listing = await prisma.listing.create({
            data: {
                applicationUserId: applicationUser.id,
                companyId,
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
                Address: {
                    create: [
                        {...address}
                    ]
                },
                ListingPrice: {
                    create: [
                        {currency, price}
                    ]
                },
                ListingImage: {
                    create: [
                        ...images
                    ]
                },
            },
            include: {
                ListingImage: true,
                Address: true,
                ListingPrice: true
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
            return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', {status: 400})
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
        const applicationUser: ApplicationUser = await getApplicationUserServer(true)
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
            heatingType,
            address,
            currency,
            price
        } = parsedValues

        const listing = await prisma.listing.findUnique({
            where: {
                id,
                deleted: null,
            },
        })
        if (!listing) throw new ResponseError("Listing with provided id wasn't found.", 404)

        // Get user's company id
        let applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);

        const applicationUserId = applicationUser.id;

        // Check if the user can edit the listing
        if (!userAllowedManipulateListing(applicationUserId, applicationUserCompanyId, listing)) throw new ResponseError("You aren't allowed to changed this property", 401)


        // Update images or create new images if
        if (images) {
            for (let i = 0; i < images.length; i++) {
                let image = images[i];

                // if image position is -1 delete it
                if (image.positionInListing == -1 && image.id) {
                    await prisma.listingImage.delete({
                        where: {
                            id: image.id,
                        }
                    });
                }

                // if no id then create an image
                if (!image.id) {
                    await prisma.listingImage.create({
                        data: {
                            ...image,
                            listingId: id,
                        }
                    });
                } else {
                    // else update it
                    await prisma.listingImage.update({
                        where: {
                            id: image.id,
                            listingId: id
                        },
                        data: {
                            ...image
                        }
                    });
                }
            }
        }

        // if user is changing the address
        if (address) {
            // else update it
            await prisma.address.update({
                where: {
                    id: address.id,
                    listingId: id
                },
                data: {
                    ...address
                }
            })
        }

        // If there is a price and currency create listing price record
        if (price && currency) {
            await prisma.listingPrice.create({
                data: {
                    price,
                    currency
                }
            })
        }

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
            },
            include: {
                ListingImage: true,
                Address: true,
                ListingPrice: true,
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
            return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', {status: 400})
        }

        return new Response('Something went wrong please try again later', {
            status: 500,
        })
    }
}
