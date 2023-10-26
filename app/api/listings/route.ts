import { NextRequest, NextResponse } from "next/server";
import { listingSchema, listingSchemaPutRequest } from "@/app/lib/validations/listing";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import {
  buildPrismaQueryConditions,
  ensureUserHasListingAccess,
  extractParametersGET,
  handleAddressUpdate,
  handleImagesUpdate,
  handleListingErrors,
  handlePriceUpdate,
  validateListingExistence
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
    return handleListingErrors(error);
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
    const { address, currency, price, images, ...restData } = parsedValues;

    // Get user's company id
    let companyId = getApplicationUserCompanyId(applicationUser);

    const listing = await prisma.listing.create({
      data: {
        applicationUserId: applicationUser.id,
        companyId,
        ...restData,
        price,
        currency,
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
    return handleListingErrors(error);
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

    const listing = await validateListingExistence(id);

    ensureUserHasListingAccess(applicationUser, listing);

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
    return handleListingErrors(error);
  }
}
