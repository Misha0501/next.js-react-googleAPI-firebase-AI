import { ContactForm } from "@/app/components/shared/ContactForm";
import { ContactFormProvider } from "@/providers/ContactForm/types";

interface PropInterface {
  name: string;
  targetType: ContactFormProvider.ContactTargetType;
  targetId: number;
  subject?: string;
}
export const ListingContactAgentForm = ({
  name,
  targetType,
  targetId,
  subject,
}: PropInterface) => {
  return (
    <>
      <div className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
        <p className="mb-5 text-xl font-semibold text-[#2D3648]">
          Contact {name || "Seller"}
        </p>
        <ContactForm
          targetType={targetType}
          targetId={targetId}
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
