import * as z from "zod"

export const savedListingsSchema = z.object({
    listingId: z.number(),
})




