import { NextResponse } from "next/server";
import { ApplicationUser, Prisma } from "@prisma/client";
import { z } from "zod";
import { ResponseError } from "@/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { companyPUTSchema, companySchema } from "@/app/lib/validations/company";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";

/**
 * POST Route to create a new company.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);

    const parsedValues = companySchema.parse(await req.json());
    let { name, description, phoneNumber, address, email } = parsedValues;

    // check if the user already has a membership
    const membership = await prisma.membership.findUnique({
      where: {
        applicationUserId: applicationUser.id,
      },
    });

    if (membership)
      return new Response("You are already a member of a company", {
        status: 400,
      });

    const company = await prisma.company.create({
      data: {
        description,
        email,
        name,
        phoneNumber,
        Address: {
          create: {
            ...address,
          },
        },
        memberships: {
          create: {
            applicationUserId: applicationUser.id,
            applicationUserRole: "admin",
          },
        },
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        return new Response(
          "Company with this name already exists, please select a different name",
          { status: 400 },
        );
      }
    }

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}

/**
 * PUT Route to update company.
 * @param req
 * @constructor
 */
export async function PUT(req: Request) {
  try {
    const applicationUser: ApplicationUser =
      await getApplicationUserServer(true);
    const parsedValues = companyPUTSchema.parse(await req.json());
    const { id, description, address, phoneNumber, email, name } = parsedValues;

    // find the company
    const company = await prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!company)
      throw new ResponseError("Company with provided id wasn't found.", 404);

    // Get user's company id
    let applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);

    // Check if the user can edit the listing
    if (company.id !== applicationUserCompanyId)
      throw new ResponseError(
        "You aren't allowed to changed this property",
        401,
      );

    let updatedAddress = null;
    // if user is changing the address
    if (address) {
      // else update it
      updatedAddress = prisma.address.update({
        where: {
          id: address.id,
          companyId: id,
        },
        data: {
          ...address,
        },
      });
    }

    const updatedCompany = prisma.company.update({
      where: {
        id,
      },
      data: {
        description,
        email,
        name,
        phoneNumber,
      },
      include: {
        Address: true,
      },
    });

    // add transactions to array if they exist
    if (updatedAddress && updatedCompany) {
      const result = await prisma.$transaction([
        updatedAddress,
        updatedCompany,
      ]);

      return NextResponse.json(result[1]);
    }

    const result = await prisma.$transaction([updatedCompany]);
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return new Response(
          "Company with this name already exists, please select a different name",
          { status: 400 },
        );
      }

      if (error.code === "P2025") {
        return new Response(
          "Company or address with this given id wasn't found.",
          { status: 400 },
        );
      }
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    return new Response("Something went wrong please try again later", {
      status: 500,
    });
  }
}
