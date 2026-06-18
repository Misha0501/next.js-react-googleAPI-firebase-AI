/**
 * Standalone sitemap generator script.
 *
 * Usage (from project root):
 *   npm run sitemap:print          — prints XML to stdout (dev DB)
 *   npm run sitemap:save           — saves to public/sitemap-preview.xml (dev DB)
 *   npm run sitemap:print:prod     — prints XML to stdout (prod DB)
 *   npm run sitemap:save:prod      — saves to public/sitemap-preview.xml (prod DB)
 *
 * Environment is injected by dotenv-cli via the npm scripts. You do not need
 * to manually call dotenv.config() here.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";
import { getSiteOrigin } from "@/app/lib/siteOrigin";

const adapter = new PrismaPg(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function buildSitemapXml(): Promise<string> {
  const base = getSiteOrigin();

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
  });

  const hasImages = listings.some((l) => l.ListingImage[0]?.url);
  const imageNs = hasImages
    ? '\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : "";

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNs}>`,
  ];

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages = [
    { loc: base, changefreq: "daily", priority: "1.0" },
    { loc: `${base}/listings`, changefreq: "hourly", priority: "0.9" },
    { loc: `${base}/contact`, changefreq: "monthly", priority: "0.5" },
  ];

  for (const p of staticPages) {
    lines.push(`  <url>`);
    lines.push(`    <loc>${esc(p.loc)}</loc>`);
    lines.push(`    <changefreq>${p.changefreq}</changefreq>`);
    lines.push(`    <priority>${p.priority}</priority>`);
    lines.push(`  </url>`);
  }

  // ── Listing pages ─────────────────────────────────────────────────────────
  for (const listing of listings) {
    const loc = `${base}/listings/${listing.id}`;
    const imageUrl = listing.ListingImage[0]?.url;

    lines.push(`  <url>`);
    lines.push(`    <loc>${esc(loc)}</loc>`);
    lines.push(`    <lastmod>${listing.updatedAt.toISOString()}</lastmod>`);
    lines.push(`    <changefreq>weekly</changefreq>`);
    lines.push(`    <priority>0.8</priority>`);
    if (imageUrl) {
      lines.push(`    <image:image>`);
      lines.push(`      <image:loc>${esc(imageUrl)}</image:loc>`);
      lines.push(`    </image:image>`);
    }
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  return lines.join("\n");
}

async function main() {
  const save = process.argv.includes("--save");
  const outputArg = process.argv.find((a) => a.startsWith("--output="));
  const outputPath = outputArg
    ? outputArg.split("=")[1]
    : path.resolve(process.cwd(), "public", "sitemap-preview.xml");

  try {
    const xml = await buildSitemapXml();

    if (save) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, xml, "utf-8");
      console.error(`Sitemap saved → ${outputPath}`);
    } else {
      process.stdout.write(xml + "\n");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
