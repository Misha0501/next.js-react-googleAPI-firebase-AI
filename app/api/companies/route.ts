import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { requireUser } from "@/app/lib/auth/requireUser";
import { prisma } from "@/app/lib/db/client";
import { companyPUTSchema, companySchema } from "@/app/lib/validations/company";
import { handleAPIError } from "@/app/lib/api/handleError";
import { userHasMembership } from "@/app/api/companies/_utils";
import {
  ensureActiveCompanyAdmin,
  getActiveMembership,
} from "@/app/api/companyMembershipInvites/_utils";

/**
 * POST Route to create a new company.
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  try {
    const { user: applicationUser } = await requireUser(req);

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
            applicationUserRole: "ADMIN",
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
    const { user: applicationUser } = await requireUser(req);
    const parsedValues = companyPUTSchema.parse(await req.json());
    const { id, description, address, phoneNumber, email, name } = parsedValues;

    const company = await prisma.company.findUnique({ where: { id } });

    if (!company)
      throw new ResponseError("Company with provided id wasn't found.", 404);

    const activeMembership = await getActiveMembership(applicationUser.id);
    ensureActiveCompanyAdmin(activeMembership, company.id);

    let transactions: Prisma.PrismaPromise<unknown>[] = [];

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
