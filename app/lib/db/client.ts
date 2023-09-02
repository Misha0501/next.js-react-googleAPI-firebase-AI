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
    cacheTime: 20,
    // onHit: (key) => {
    //     console.log("hit", key);
    // },
    // onMiss: (key) => {
    //     console.log("miss", key);
    // },
    // onError: (key) => {
    //     console.log("error", key);
    // },
});


// Prisma use soft delete for listing table
prismaClient.$use(async (params, next) => {
    // Check incoming query type
    if (params.model == 'Listing') {
        if (params.action == 'delete') {
            // Delete queries
            // Change action to an update
            params.action = 'update'
            params.args['data'] = { deleted: new Date() }
        }
        if (params.action == 'deleteMany') {
            // Delete many queries
            params.action = 'updateMany'
            if (params.args.data != undefined) {
                params.args.data['deleted'] = new Date()
            } else {
                params.args['data'] = { deleted: new Date() }
            }
        }
    }
    return next(params)
})


prismaClient.$use(cacheMiddleware);

export const prisma = prismaClient;