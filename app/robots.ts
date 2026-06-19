import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/app/lib/sitemap/getSiteUrl"

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/profile/",
          "/edit/",
          "/placeproperties/",
          "/signin/",
          "/forgot-password/",
          "/reset-password/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
