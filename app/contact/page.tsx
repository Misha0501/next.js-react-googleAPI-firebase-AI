import type { Metadata } from "next";
import { ContactForm } from "@/app/components/shared/ContactForm";
import { getSiteUrl } from "@/app/lib/sitemap/getSiteUrl";

const title = "Contact — Homfli";
const description = "Get in touch with the Homfli team.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${getSiteUrl()}/contact`,
  },
};

const ContactPage = () => {
  return (
    <main className="bg-[#F8FAFC]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[720px] px-4 py-14 text-center sm:px-6 lg:py-16">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
            Contact
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#1F2937] sm:text-5xl">
            Contact
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#475569]">
            Have a question about Homfli, a property, or the platform itself?
            Reach out using the form below or email us directly.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-[560px] rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <ContactForm
            emailTo="contact@homfli.com"
            showSubject
            showPhone={false}
            requireMessageMinLength
            successMode="inline"
            submitLabel="Send message"
          />

          <div className="mt-8 border-t border-slate-200 pt-6 text-sm leading-6 text-[#64748B]">
            <p>
              Or email us directly:{" "}
              <a
                href="mailto:contact@homfli.com"
                className="font-bold text-[#1F5FD6]"
              >
                contact@homfli.com
              </a>
            </p>
            <p className="mt-2">
              We typically respond within 2-3 business days.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
