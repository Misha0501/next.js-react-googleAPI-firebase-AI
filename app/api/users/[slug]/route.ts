import { ResponseError } from "@/app/lib/classes/ResponseError";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";

/**
 * GET Route to retrieve application user with provided id.
 * @param req
 * @constructor
 * @param request
 */
export async function GET(request: Request, {params}: { params: { slug: number } }) {
  try {
    const id = Number(params.slug)

    if (isNaN(id)) throw new ResponseError("ID must be a valid number", 422);

    // Get application user
    const applicationUser =  await prisma.applicationUser.findUnique({
      where: {id},
      include: {
        Membership: true,
        Listing: {
          include: {
            ListingImage: true,
            Address: true,
            ListingPrice: true,
          },
          where: {
            deleted: null,
          }
        },
      },
    });

    let applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);

    // if applicationUserCompanyId exists get all available info about that company
    if(applicationUserCompanyId) {
      applicationUser.Company = await prisma.company.findUnique({
        where: {
          id: applicationUserCompanyId
        },
        include: {
          Address: true,
          Listing: {
            include: {
              ListingImage: true,
              Address: true,
              ListingPrice: true,
            },
            where: {
              deleted: null,
            }
          },
        },
      });
    }

    // if user is part of a company then show only company's listigs
    if(applicationUser?.Company) {
      delete applicationUser?.Listing;
    }

    // delete all unnecessary for end user properties
    delete applicationUser?.Membership;
    delete applicationUser?.firebaseUID;
    delete applicationUser?.providerId;
    delete applicationUser?.updatedAt;

    return NextResponse.json(applicationUser)
  } catch (error) {
    console.error(error)
    if (error instanceof ResponseError) {
      return new Response(error.message, {status: error.status})
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response('Your auth token is invalid or it has expired. Get a new auth token and try again.', {status: 400})
    }

    return new Response('Something went wrong please try again later', {
      status: 500,
    })
  }
}
