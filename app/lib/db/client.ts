import { PrismaClient, Prisma } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

function buildClient(): PrismaClient {
  const client = new PrismaClient();

  client.$use(
    async (
      params: Prisma.MiddlewareParams,
      next: (params: Prisma.MiddlewareParams) => Promise<unknown>,
    ) => {
      if (params.model === "Listing") {
        if (params.action === "delete") {
          params.action = "update";
          (params.args as Record<string, unknown>)["data"] = {
            deleted: new Date(),
          };
        }
        if (params.action === "deleteMany") {
          params.action = "updateMany";
          const args = params.args as Record<string, Record<string, unknown>>;
          if (args.data !== undefined) {
            args.data["deleted"] = new Date();
          } else {
            args["data"] = { deleted: new Date() };
          }
        }
      }
      return next(params);
    },
  );

  return client;
}

if (process.env.NODE_ENV === "production") {
  global.prismaClient = buildClient();
} else {
  if (!global.prismaClient) {
    global.prismaClient = buildClient();
  }
}

export const prisma = global.prismaClient;
