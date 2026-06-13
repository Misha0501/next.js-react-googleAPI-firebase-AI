// @ts-nocheck
import {PrismaClient} from '@prisma/client'

let prismaClient;

// Using below construction to avoid creating multiple instances of PrismaClient in development mode
if (process.env.NODE_ENV === "production") {
    prismaClient = new PrismaClient()
} else {
    if (!global.prismaClient) {
        global.prismaClient = new PrismaClient()
    }
    prismaClient = global.prismaClient
}

// Prisma use soft delete for listing table
prismaClient.$use(async (params: any, next: any) => {
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


export const prisma = prismaClient;