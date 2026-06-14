import React from "react";
import { Listing } from "@/types";
import Link from "next/link";
import { CheckCircleIcon, HomeModernIcon } from "@heroicons/react/24/outline";

type Props = {
  listingItem: Listing | null;
};

function NextToConfirmationPage({ listingItem }: Props) {
  const listingHref = listingItem?.id
    ? `/listings/${listingItem.id}`
    : "/profile/myProperties";

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#1F5FD6]">
          <CheckCircleIcon className="h-9 w-9" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
          Listing published
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#1F2937] md:text-5xl">
          Your property is live.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#64748B] md:text-base">
          The listing has been created successfully. You can open it now or
          manage it from your profile.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={listingHref}
            className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] sm:w-auto"
          >
            <HomeModernIcon className="h-4 w-4" />
            View listing
          </Link>
          <Link
            href="/profile/myProperties"
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#334155] transition hover:border-[#1F5FD6] hover:text-[#1F5FD6] sm:w-auto"
          >
            My properties
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NextToConfirmationPage;
