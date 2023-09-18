import * as z from "zod"

export const recentlyViewedListingsSchema = z.object({
    listingId: z.number(),
})
