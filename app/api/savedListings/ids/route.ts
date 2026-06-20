import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/auth/requireUser";
import { getSavedListingIds } from "@/app/api/savedListings/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";

export async function GET() {
  try {
    const { user: applicationUser } = await requireUser();
    const ids = await getSavedListingIds(applicationUser.id);
    return NextResponse.json(ids);
  } catch (error) {
    return handleAPIError(error);
  }
}
