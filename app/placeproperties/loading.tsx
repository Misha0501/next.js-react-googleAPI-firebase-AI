import { Skeleton } from "@/app/components/shared/Skeleton";

const PlacePropertiesLoading = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="mb-3 h-4 w-40 rounded-xl bg-slate-200" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <Skeleton className="h-8 w-full max-w-xl rounded-xl bg-slate-200 sm:h-10" />
              <Skeleton className="h-5 w-full max-w-md rounded-xl bg-slate-200" />
            </div>
            <Skeleton className="h-11 w-36 rounded-xl bg-slate-200" />
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8">
          <div className="hidden grid-cols-4 gap-3 lg:grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[88px] rounded-2xl bg-slate-200"
              />
            ))}
          </div>

          <div className="lg:hidden">
            <div className="mb-3 flex gap-1.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-1.5 flex-1 rounded-full bg-slate-200"
                />
              ))}
            </div>
            <Skeleton className="h-5 w-40 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <Skeleton className="h-6 w-48 rounded-xl bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-xl bg-slate-200" />
                <Skeleton className="h-11 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default PlacePropertiesLoading;
