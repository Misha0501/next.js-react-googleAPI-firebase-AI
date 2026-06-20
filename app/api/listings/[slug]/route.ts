import { ResponseError } from "@/app/lib/classes/ResponseError";
import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth/requireUser";
import { Listing } from "@/types";
import { getListingDetailById } from "@/app/lib/listing/getListingDetailById";
import {
  deleteListingAndAssociatedEntities,
  ensureUserHasListingAccess,
  validateListingExistence,
} from "@/app/api/listings/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";
import { validateParamId } from "@/app/lib/api/validateParamId";

/**
 * GET Route to retrieve specific listing with provided slug.
 * @param req
 * @constructor
 * @param request
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const id = validateParamId(slug);

    const listing = await getListingDetailById(id);

    if (!listing)
      throw new ResponseError("Property with provided id wasn't found.", 404);

    return NextResponse.json(listing);
  } catch (error) {
    return handleAPIError(error);
  }
}

/**
 * DELETE Route to delete a listing.
 * @param req
 * @constructor
 * @param request
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const id = validateParamId(slug);

    const { user: applicationUser } = await requireUser();

    const listing = await validateListingExistence(id);

    ensureUserHasListingAccess(applicationUser, listing as unknown as Listing);

    await deleteListingAndAssociatedEntities(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleAPIError(error);
  }
}
