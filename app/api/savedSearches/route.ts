import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { savedFiltersSchema } from "@/app/lib/validations/savedFilters";

/**
 * GET Route to retrieve saved searches.
 * @param req
 * @param route
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser = await getApplicationUserServer(true);

    const savedSearchesCount = await prisma.savedSearch.count({
      where: {
        applicationUserId: applicationUser.id,
      },
    })

    let savedSearches = await prisma.savedSearch.findMany({
      where: {
        applicationUserId: applicationUser.id,
      },
    })

    return NextResponse.json({total: savedSearchesCount, results: savedSearches})
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
 * POST Route to post new saved search.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = savedFiltersSchema.parse(await req.json());
    const {
      locality,
      heatingType,
      listingType,
      interiorType,
      propertyType,
      currencyType,
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
      listedSince,
      priceMin,
      priceMax,
    } = parsedValues;


    const savedSearch = await prisma.savedSearch.create({
      data: {
        applicationUserId: applicationUser.id,
        locality,
        heatingType,
        listingType,
        interiorType,
        propertyType,
        currencyType,
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
        listedSince,
        priceMin,
        priceMax,
      },
    });

    return NextResponse.json(savedSearch);
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
