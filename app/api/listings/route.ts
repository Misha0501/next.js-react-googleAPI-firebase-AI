import { NextRequest, NextResponse } from "next/server";
import { listingSchema, listingSchemaPutRequest } from "@/app/lib/validations/listing";
import { z } from "zod";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import {
  buildPrismaQueryConditions,
  extractParametersGET,
  handleAddressUpdate,
  handleImagesUpdate,
  handlePriceUpdate,
  isUserAuthorizedToListing
} from "@/app/api/listings/_utils";
import { ApplicationUser } from "@prisma/client";

/**
 * GET Route to retrieve listings.
 * @param req
 * @param route
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const params = extractParametersGET(req);

    let prismaQueryConditions = buildPrismaQueryConditions(params);

    const page = params.page || 1;
    const pageSize = params.pageSize || 25;

    const offsetRecords = (page - 1) * pageSize;

    const totalRecordsCount = await prisma.listing.count({
      where: {
        ...prismaQueryConditions,
        deleted: null,
      },
    });

    // Get listing that weren't deleted and that match the search criteria
    const listings = await prisma.listing.findMany({
      skip: offsetRecords,
      take: pageSize,
      where: {
        deleted: null,
        ...prismaQueryConditions,
      },
      include: {
        ListingImage: true,
        Address: true,
        ListingPrice: true,
      },
    });

    return NextResponse.json({
      page,
      pageSize,
      total: totalRecordsCount,
      results: listings,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}

/**
 * POST Route to post new listing.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = listingSchema.parse(await req.json());
    const {
      listingType,
      interiorType,
      propertyType,
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
      currency,
    } = parsedValues;

    // Get user's company id
    let companyId = getApplicationUserCompanyId(applicationUser);

    const listing = await prisma.listing.create({
      data: {
        applicationUserId: applicationUser.id,
        companyId,
        listingType,
        interiorType,
        propertyType,
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
        price,
        currency,
        heatingType,
        Address: {
          create: [{ ...address }],
        },
        ListingPrice: {
          create: [{ currency, price }],
        },
        ListingImage: {
          create: [...images],
        },
      },
      include: {
        ListingImage: true,
        Address: true,
        ListingPrice: true,
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}

/**
 * PUT Route to update listing.
 * @param req
 * @constructor
 */
export async function PUT(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);
    const parsedValues = listingSchemaPutRequest.parse(await req.json());

    const { id, images, address, price, currency, ...restData } = parsedValues;

    const listing = await prisma.listing.findUnique({
      where: {
        id,
        deleted: null,
      },
    });
    if (!listing)
      throw new ResponseError("Listing with provided id wasn't found.", 404);

    if (!isUserAuthorizedToListing(applicationUser, listing))
      throw new ResponseError(
        "You aren't allowed to change this property",
        401,
      );

    if (images) await handleImagesUpdate(id, images);

    await handleAddressUpdate(id, address);
    await handlePriceUpdate(id, price, currency);

    const updatedListing = await prisma.listing.update({
      where: {
        id,
      },
      data: {
        price,
        currency,
        ...restData,
      },
      include: {
        ListingImage: true,
        Address: true,
        ListingPrice: true,
      },
    });
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}
