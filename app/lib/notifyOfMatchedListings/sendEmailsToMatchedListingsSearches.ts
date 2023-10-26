import { sendEmail } from "@/app/lib/email";
import { prisma } from "@/app/lib/db/client";
import { MatchedListingsAndSearches } from "@/types";

/**
 * Sends emails to users with matched listings/saved searches
 * @param matchedListingsAndSearches Matched listings and saved searches
 */
export const sendEmailsToMatchedListingsSearches = async (matchedListingsAndSearches: MatchedListingsAndSearches[]) => {
  // Send emails to users with matched listings/saved searches
  for (let i = 0; i < matchedListingsAndSearches.length; i++) {
    const matchedListing = matchedListingsAndSearches[i].listing;
    const matchedSearches = matchedListingsAndSearches[i].matchedSearches;

    for (let j = 0; j < matchedSearches.length; j++) {
      const matchedSearch = matchedSearches[j];
      const applicationUser = matchedSearch.applicationUser;
      if(!applicationUser) continue;

      try {
        // Send email to user with matched listing and a link to the listing
        await sendEmail({
          to: applicationUser.email,
          subject: "A property is placed that matches your saved search!",
          html: `
            <h1>Hi there!</h1>
            <p>A property that matches your saved search has been posted!</p>
            <p>View the property via the below link:</p>
            <a href="http://localhost:3000/listings/${matchedListing.id}">View listing</a>
          `
        });

        // Save notification to the database
        await prisma.sentNotificationSavedSearch.create({
          data: {
            savedSearchId: matchedSearch.id,
            listingId: matchedListing.id
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
