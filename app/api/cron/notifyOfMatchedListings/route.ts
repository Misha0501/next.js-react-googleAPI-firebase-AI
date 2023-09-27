import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ResponseError } from "@/classes/ResponseError";
import { prisma } from "@/app/lib/db/client";
import { MatchedListingsAndSearches } from "@/types";
import { getMatchedListingsAndSearches } from "@/app/lib/notifyOfMatchedListings/getMatchedListingsAndSearches";
import {
  sendEmailsToMatchedListingsSearches
} from "@/app/lib/notifyOfMatchedListings/SendEmailsToMatchedListingsSearches";

export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page

export async function GET(request: Request) {
  try {
    // Get all saved searches
    let savedSearches = await prisma.savedSearch.findMany({
      include: {
        applicationUser: true
      }
    });

    // Get all listings that were created in the last 24 hours
    let listings = await prisma.listing.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 240 * 60 * 60 * 1000)
        }
      },
      include: {
        Address: true,
      }
    });

    // Get matched listings and searches
    let matchedListingsAndSearches: MatchedListingsAndSearches = getMatchedListingsAndSearches(savedSearches, listings);

    // Send emails to users with matched listings/saved searches
    await sendEmailsToMatchedListingsSearches(matchedListingsAndSearches);

    return NextResponse.json({ results: matchedListingsAndSearches, savedSearches });
  } catch (error) {
    console.error(error);

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 }
      );
    }

    return new Response("Something went wrong, please try again later.", {
      status: 500
    });
  }
}
