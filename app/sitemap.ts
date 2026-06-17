import type { MetadataRoute } from "next"
import { prisma } from "@/app/lib/db/client"
import { getSiteUrl } from "@/app/lib/sitemap/getSiteUrl"

// Always fetch live data — search engines won't hammer this endpoint
export const dynamic = "force-dynamic"

const STATIC_PAGES: MetadataRoute.Sitemap = (() => {
  const base = getSiteUrl()
  return [
    {
      url: base,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${base}/listings`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${base}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
})()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()

  const listings = await prisma.listing.findMany({
    where: { deleted: null, active: true },
    select: {
      id: true,
      updatedAt: true,
      ListingImage: {
        select: { url: true },
        orderBy: [{ positionInListing: "asc" }, { createdAt: "asc" }],
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  const listingEntries: MetadataRoute.Sitemap = listings.map((listing) => {
    // Next.js writes image URLs raw with no XML escaping, so we must
    // pre-escape & ourselves (Firebase Storage URLs contain &token=...)
    const imageUrl = listing.ListingImage[0]?.url?.replace(/&/g, "&amp;")
    return {
      url: `${base}/listings/${listing.id}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    }
  })

  return [...STATIC_PAGES, ...listingEntries]
}
