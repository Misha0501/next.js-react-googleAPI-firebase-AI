import { NextResponse } from "next/server";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { getSavedListingIds } from "@/app/api/savedListings/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";

export async function GET() {
  try {
    const applicationUser = await getApplicationUserServer(true);
    const ids = await getSavedListingIds(applicationUser.id);
    return NextResponse.json(ids);
  } catch (error) {
    return handleAPIError(error);
  }
}
