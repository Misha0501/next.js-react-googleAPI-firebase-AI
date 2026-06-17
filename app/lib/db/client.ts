import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

type ExtendedPrismaClient = ReturnType<typeof buildClient>;

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: ExtendedPrismaClient | undefined;
}

function buildClient() {
  const adapter = new PrismaPg(process.env.DATABASE_URL!);

  const base = new PrismaClient({ adapter });

  // Soft-delete: intercept delete/deleteMany on Listing and set deleted timestamp instead.
  return base.$extends({
    query: {
      listing: {
        async delete({ args }) {
          return base.listing.update({
            where: args.where,
            data: { deleted: new Date() },
          });
        },
        async deleteMany({ args }) {
          return base.listing.updateMany({
            where: args.where,
            data: { deleted: new Date() },
          });
        },
      },
    },
  });
}

if (process.env.NODE_ENV === "production") {
  global.prismaClient = buildClient();
} else {
  if (!global.prismaClient) {
    global.prismaClient = buildClient();
  }
}

export const prisma = global.prismaClient!;
