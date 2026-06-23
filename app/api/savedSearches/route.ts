import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth/requireUser";
import { prisma } from "@/app/lib/db/client";
import { savedFiltersSchema } from "@/app/lib/validations/savedFilters";
import { handleAPIError } from "@/app/lib/api/handleError";
import {
  fetchSavedSearches,
  fetchSavedSearchesCount,
} from "@/app/api/savedSearches/_utils";

/**
 * GET Route to retrieve saved searches.
 * @param req
 * @param route
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const { user: applicationUser } = await requireUser();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 20);

    const [savedSearchesCount, savedSearches] = await Promise.all([
      fetchSavedSearchesCount(applicationUser.id),
      fetchSavedSearches(applicationUser.id, page, pageSize),
    ]);

    return NextResponse.json({
      page,
      pageSize,
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
    const { user: applicationUser } = await requireUser(req);

    const parsedValues = savedFiltersSchema.parse(await req.json());

    const savedSearch = await prisma.savedSearch.create({
      data: { applicationUserId: applicationUser.id, ...parsedValues } as any,
    });

    return NextResponse.json(savedSearch);
  } catch (error) {
    return handleAPIError(error);
  }
}
