import { NextResponse } from "next/server";
import { MatchedListingsAndSearches } from "@/types";
import { handleAPIError } from "@/app/lib/api/handleError";
import {
  getListingsFromLastDay,
  getMatchedListingsAndSearches,
  getSavedSearchesWithUser,
  sendEmailsToMatchedListingsSearches,
} from "@/app/api/cron/notifyOfMatchedListings/_utils";

export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    // return an empty response for testing purposes
    return NextResponse.json({
      results: [],
    });

    const savedSearches = await getSavedSearchesWithUser();

    const listings = await getListingsFromLastDay();

    // Get matched listings and searches
    let matchedListingsAndSearches: MatchedListingsAndSearches[] =
      getMatchedListingsAndSearches(savedSearches, listings);

    // Send emails to users with matched listings/saved searches
    await sendEmailsToMatchedListingsSearches(matchedListingsAndSearches);


  } catch (error) {
    return handleAPIError(error);
  }
}
