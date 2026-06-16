import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import { handleAPIError } from "@/app/lib/api/handleError";
import { validateParamId } from "@/app/lib/api/validateParamId";

const listingInclude = {
  ListingImage: true,
  Address: true,
  ListingPrice: {
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} as const;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const id = validateParamId(slug);

    const applicationUser = await prisma.applicationUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        phoneNumber: true,
        createdAt: true,
        Membership: {
          select: {
            companyId: true,
            applicationUserRole: true,
            isActive: true,
          },
        },
        Listing: {
          where: { deleted: null },
          include: listingInclude,
        },
      },
    });

    const applicationUserCompanyId =
      getApplicationUserCompanyId(applicationUser);

    if (applicationUserCompanyId) {
      const company = await prisma.company.findUnique({
        where: { id: applicationUserCompanyId },
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          description: true,
          email: true,
          createdAt: true,
          Address: true,
          Listing: {
            where: { deleted: null },
            include: listingInclude,
          },
        },
      });

      return NextResponse.json({
        ...applicationUser,
        Membership: undefined,
        Listing: undefined,
        Company: company,
      });
    }

    return NextResponse.json({
      ...applicationUser,
      Membership: undefined,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
