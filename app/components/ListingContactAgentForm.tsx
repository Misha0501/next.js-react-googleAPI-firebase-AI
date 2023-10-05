import { ContactForm } from "@/app/components/ContactForm";

interface PropInterface {
  name: string;
  emailTo: string;
  subject?: string;
}
export const ListingContactAgentForm = ({ name, emailTo, subject }: PropInterface) => {
  return (
    <>
      <div className=" w-full bg-[#F2F2F2]  rounded-lg shadow-md px-8 py-9">
        <p className="mb-4 text-2xl font-bold">
          Contact {name || 'Seller'}
        </p>
        <ContactForm emailTo={emailTo} subject={subject ?? 'Someone is interested in your property!' } />
        <p className="mt-6 text-[12px]  font-light text-[#848484]">
          When you send an enquiry, you accept our terms & privacy policy. Your
          enquiry will be sent to the estate agent shown, who will reply to you
          with more information.
        </p>
      </div>
    </>
  );
}
