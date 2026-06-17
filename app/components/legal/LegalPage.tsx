import type { ReactNode } from "react";
import Link from "next/link";

type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

type Props = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const LegalPage = ({ title, lastUpdated, intro, sections }: Props) => {
  return (
    <main className="bg-[#F8FAFC]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[720px] px-4 py-14 sm:px-6 lg:py-16">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
            Legal
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#1F2937] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm font-semibold text-[#64748B]">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 lg:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <p className="text-base leading-7 text-[#475569]">{intro}</p>

          <nav
            aria-label={`${title} sections`}
            className="my-8 rounded-2xl bg-[#F8FAFC] px-5 py-4"
          >
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#64748B]">
              On this page
            </p>
            <ul className="grid gap-2 text-sm font-semibold text-[#334155]">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="transition hover:text-[#1F5FD6]"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-2xl font-bold text-[#1F2937]">
                  {section.title}
                </h2>
                <div className="mt-3 text-base leading-7 text-[#475569]">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-10 border-t border-slate-200 pt-6 text-sm leading-6 text-[#64748B]">
            For questions about this policy, please contact us via our{" "}
            <Link href="/contact" className="font-bold text-[#1F5FD6]">
              contact form
            </Link>
            .
          </p>

          <Link
            href="/"
            className="min-h-11 mt-8 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-[#334155] transition hover:border-[#1F5FD6] hover:text-[#1F5FD6]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
};
