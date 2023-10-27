import { NextResponse } from "next/server";
import { ApplicationUser, Prisma } from "@prisma/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { getApplicationUserServer } from "@/app/lib/getApplicationUserServer";
import { prisma } from "@/app/lib/db/client";
import { companyPUTSchema, companySchema } from "@/app/lib/validations/company";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import { handleAPIError } from "@/app/lib/api/handleError";
import { userHasMembership } from "@/app/api/companies/_utils";

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

    if (await userHasMembership(applicationUser.id)) {
      return new Response("You are already a member of a company", {
        status: 400,
      });
    }

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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        return new Response(
          "Company with this name already exists, please select a different name",
          { status: 400 },
        );
      }
    }
    return handleAPIError(error);
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

    const company = await prisma.company.findUnique({ where: { id } });

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

    let transactions: any[] = [];

    if (address) {
      transactions.push(
        prisma.address.update({
          where: { id: address.id, companyId: id },
          data: { ...address },
        }),
      );
    }

    // update company
    transactions.push(
      prisma.company.update({
        where: { id },
        data: { description, email, name, phoneNumber },
        include: { Address: true },
      }),
    );

    const result = await prisma.$transaction(transactions);

    return NextResponse.json(result[result.length - 1]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error);
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
    return handleAPIError(error);
  }
}
