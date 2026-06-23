import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth/requireUser";
import { recentlyViewedListingsSchema } from "@/app/lib/validations/recentlyViewedListings";
import { handleAPIError } from "@/app/lib/api/handleError";
import {
  getRecentlyViewedListings,
  handleRecentlyViewedCreation,
} from "@/app/api/recentlyViewedListings/_utils";

/**
 * GET recently viewed listings of the user
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  try {
    const { user: applicationUser } = await requireUser();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 8);

    const recentlyViewedListings = await getRecentlyViewedListings(
      applicationUser.id,
      page,
      pageSize,
    );

    return NextResponse.json(recentlyViewedListings);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * POST Route to create recently viewed listing.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const { user: applicationUser } = await requireUser(req);

    const parsedValues = recentlyViewedListingsSchema.parse(await req.json());

    const result = await handleRecentlyViewedCreation(
      applicationUser.id,
      parsedValues.listingId,
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleAPIError(error);
  }
}
