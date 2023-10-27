import { NextRequest, NextResponse } from "next/server";
import { ApplicationUser } from "@prisma/client";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { savedFiltersSchema } from "@/app/lib/validations/savedFilters";
import { handleAPIError } from "@/app/lib/api/handleError";
import { fetchSavedSearches, fetchSavedSearchesCount } from "@/app/api/savedSearches/_utils";

/**
 * GET Route to retrieve saved searches.
 * @param req
 * @param route
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const savedSearchesCount = await fetchSavedSearchesCount(
      applicationUser.id,
    );

    const savedSearches = await fetchSavedSearches(applicationUser.id);

    return NextResponse.json({
      total: savedSearchesCount,
      results: savedSearches,
    });
  } catch (error) {
    return handleAPIError(error);
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

    const savedSearch = await prisma.savedSearch.create({
      data: {
        applicationUserId: applicationUser.id,
        ...parsedValues,
      },
    });

    return NextResponse.json(savedSearch);
  } catch (error) {
    return handleAPIError(error);
  }
}
