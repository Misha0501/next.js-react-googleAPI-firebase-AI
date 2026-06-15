"use client";

import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useListigDetailContext } from "@/app/context/ListingDetailContext";
import { useRouter } from "next/navigation";
import { Listing } from "@/types";

type Props = {
  listing?: Listing;
  initialPhoneNumber?: string;
  contactLabel?: string;
  phoneLabel?: string;
};

const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const FloatingContactBar = ({
  listing,
  initialPhoneNumber,
  contactLabel = "Contact seller",
  phoneLabel = "Call",
}: Props) => {
  const { setContactSellerFormVisible } = useListigDetailContext();
  const router = useRouter();
  const handleContactAgentClick = () => {
    setContactSellerFormVisible(true);
    // navigate to the contact form
    router.push("#contactAgentForm");
  };

  let phoneNumber =
    initialPhoneNumber ??
    listing?.company?.phoneNumber ??
    listing?.applicationUser?.phoneNumber ??
    "";
  const phoneHref = phoneNumber.replace(/\s+/g, "");

  return (
    <div
      role="region"
      aria-label="Contact actions"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+7.5rem)] z-40 px-3 lg:hidden"
    >
      <div className="pointer-events-auto mx-auto max-w-md rounded-[1.35rem] border border-white/80 bg-white/95 p-2 shadow-[0_18px_46px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div
          className={classNames(
            "grid gap-2",
            phoneNumber ? "grid-cols-[0.9fr_1.1fr]" : "grid-cols-1",
          )}
        >
          {phoneNumber && (
            <a
              href={`tel:${phoneHref}`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-3 py-3 text-xs font-black text-[#334155] shadow-sm transition hover:border-[#CFE0FF] hover:bg-[#EAF2FF] hover:text-[#1F5FD6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 sm:text-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#1F5FD6] shadow-sm">
                <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="truncate">{phoneLabel}</span>
            </a>
          )}
          <button
            type="button"
            onClick={handleContactAgentClick}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-[#1F5FD6] px-3 py-3 text-xs font-black text-white shadow-[0_14px_28px_rgba(31,95,214,0.26)] transition hover:bg-[#184FB5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-2 sm:text-sm"
          >
            <EnvelopeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="truncate">{contactLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingContactBar;
