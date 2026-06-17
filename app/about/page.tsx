import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/app/lib/sitemap/getSiteUrl";

export const metadata: Metadata = {
  title: "About — Homfli",
  description: "About Homfli, a real estate marketplace for Bulgaria.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${getSiteUrl()}/about`,
  },
};

const AboutPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:py-16">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
            About
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#1F2937] sm:text-5xl">
            Real estate search for Bulgaria, simplified.
          </h1>
          <p className="mt-5 text-base leading-7 text-[#475569]">
            Homfli brings property search, placement, saved properties, profile
            management, and AI-assisted property descriptions into one focused
            marketplace for the Bulgarian market.
          </p>
          <p className="mt-4 text-base leading-7 text-[#475569]">
            The product is designed around fast discovery, clear property
            details, and a smoother path from browsing to contacting the right
            seller or agent.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/listings"
              className="min-h-11 inline-flex items-center justify-center rounded-xl bg-[#1F5FD6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#184FB5]"
            >
              Explore properties
            </Link>
            <Link
              href="/contact"
              className="min-h-11 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#334155] transition hover:border-[#1F5FD6] hover:text-[#1F5FD6]"
            >
              Contact Homfli
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
