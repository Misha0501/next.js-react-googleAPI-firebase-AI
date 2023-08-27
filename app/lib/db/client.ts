import {redis} from "@/app/lib/redis";
import {PrismaClient} from '@prisma/client'
import {createPrismaRedisCache} from "prisma-redis-middleware";
import {Prisma} from "@prisma/client/extension";

const prismaClient = new PrismaClient();

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    models: [
        {model: "Listing"},
    ],
    storage: {type: "redis", options: {client: redis, invalidation: {referencesTTL: 300}, log: console}},
    cacheTime: 300,
    onHit: (key) => {
        console.log("hit", key);
    },
    onMiss: (key) => {
        console.log("miss", key);
    },
    onError: (key) => {
        console.log("error", key);
    },
});

prismaClient.$use(cacheMiddleware);

export const prisma = prismaClient;