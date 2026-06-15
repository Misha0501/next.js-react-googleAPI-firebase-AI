import { NextRequest, NextResponse } from "next/server";
import { listingSchema, listingSchemaPutRequest } from "@/app/lib/validations/listing";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import {
  buildPrismaQueryConditions,
  buildPrismaOrderBy,
  ensureUserHasListingAccess,
  extractParametersGET,
  handleAddressUpdate,
  handleImagesUpdate,
  handlePriceUpdate,
  validateListingExistence
} from "@/app/api/listings/_utils";
import { ApplicationUser } from "@/types";
import { handleAPIError } from "@/app/lib/api/handleError";

const DEFAULT_LISTINGS_PAGE_SIZE = 16;

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
    const pageSize = params.pageSize || DEFAULT_LISTINGS_PAGE_SIZE;

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
      orderBy: buildPrismaOrderBy(params.sortBy),
      include: {
        ListingImage: true,
        Address: true,
        ListingPrice: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      page,
      pageSize,
      total: totalRecordsCount,
      results: listings,
    });
  } catch (error) {
    return handleAPIError(error);
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

    // active until 30 days from now
    const activeUntil = new Date();
    activeUntil.setDate(activeUntil.getDate() + 30);

    const listing = await prisma.listing.create({
      data: {
        applicationUserId: applicationUser.id,
        companyId,
        ...restData,
        price,
        currency,
        active: true,
        activeUntil: activeUntil,
        Address: {
          create: [{ ...address }],
        },
        ListingPrice: {
          create: [{ currency, price }],
        },
        ListingImage: {
          // @ts-ignore
          create: [...images],
        },
      },
      include: {
        ListingImage: true,
        Address: true,
        ListingPrice: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    return handleAPIError(error);
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

    if (images) await handleImagesUpdate(id, images as Parameters<typeof handleImagesUpdate>[1]);

    await handleAddressUpdate(id, address as Parameters<typeof handleAddressUpdate>[1]);
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
        ListingPrice: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return NextResponse.json(updatedListing);
  } catch (error) {
    return handleAPIError(error);
  }
}
