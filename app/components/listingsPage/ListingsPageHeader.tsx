"use client";
import Autocomplete from "@/app/components/Autocomplete";

export const ListingsPageHeader = ({
  onLocalityChange,
  initialLocality,
}: any) => {
  const handleOnSubmit = (e: any) => {
    // get the value from input with name="locality"
    e.preventDefault();
    const locality = e.target?.locality?.value;
    if (locality) {
      onLocalityChange(locality);
    } else {
      onLocalityChange("");
    }
  };

  return (
    <header className="border-b border-slate-200/80 bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_100%)] py-10 lg:py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
              Property search
            </p>
            <h1 className="text-3xl font-bold text-[#222222] md:text-[44px] md:leading-tight">
              {initialLocality
                ? `Properties in ${initialLocality}`
                : "Find properties in Bulgaria"}
            </h1>
            <p className="mt-3 max-w-xl text-[#717D96]">
              Search by city, refine by practical details, and compare homes
              with a clearer view of what matters.
            </p>
          </div>

          <form
            className="flex w-full items-center rounded-xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            onSubmit={handleOnSubmit}
          >
            <Autocomplete
              onLocalityChange={onLocalityChange}
              initialValue={initialLocality}
            />
          </form>
        </div>
      </div>
    </header>
  );
};
