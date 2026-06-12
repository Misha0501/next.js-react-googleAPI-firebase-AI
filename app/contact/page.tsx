import { ContactForm } from "@/app/components/ContactForm";

export default function ContactPage() {
  return (
    <div>
      {/* Header band */}
      <div className="bg-[#EDF0F7] py-16 md:py-24 text-center">
        <div className="container">
          <p className="text-xs tracking-[0.2em] uppercase text-[#717D96] mb-4 font-medium">
            Real Estate &middot; Bulgaria
          </p>
          <h1 className="font-semibold text-[#2D3648] mb-5">Get in touch</h1>
          <p className="text-lg text-[#717D96] max-w-md mx-auto leading-relaxed">
            Have a question or a proposition? We&rsquo;d love to hear from you.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-lg mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm px-8 py-10 md:px-12 md:py-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
