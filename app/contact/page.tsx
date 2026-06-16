import type { Metadata } from "next";
import { ContactForm } from "@/app/components/shared/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with our real estate team. We help buyers, sellers, and renters across Bulgaria.",
};

const ContactPage = () => {
  return (
    <div>
      {/* Header band */}
      <div className="bg-[#EDF0F7] py-16 text-center md:py-24">
        <div className="container">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#717D96]">
            Real Estate &middot; Bulgaria
          </p>
          <h1 className="mb-5 font-semibold text-[#2D3648]">Get in touch</h1>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-[#717D96]">
            Have a question or a proposition? We&rsquo;d love to hear from you.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm md:px-12 md:py-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
