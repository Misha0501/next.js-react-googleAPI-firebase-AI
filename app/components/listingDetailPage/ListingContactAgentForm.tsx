import { ContactForm } from "@/app/components/shared/ContactForm";

interface PropInterface {
  name: string;
  emailTo: string;
  subject?: string;
}
export const ListingContactAgentForm = ({
  name,
  emailTo,
  subject,
}: PropInterface) => {
  return (
    <>
      <div className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
        <p className="mb-5 text-xl font-semibold text-[#2D3648]">
          Contact {name || "Seller"}
        </p>
        <ContactForm
          emailTo={emailTo}
          subject={subject ?? "Someone is interested in your property!"}
        />
        <p className="mt-6 text-xs leading-5 text-[#717D96]">
          When you send an enquiry, you accept our terms & privacy policy. Your
          enquiry will be sent to the estate agent shown, who will reply to you
          with more information.
        </p>
      </div>
    </>
  );
};
