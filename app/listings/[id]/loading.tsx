import { Skeleton } from "@/app/components/shared/Skeleton";

const ListingDetailLoading = () => {
  return (
    <div className="bg-[#F8FAFC] pb-32 lg:pb-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 pb-8 pt-6 lg:space-y-8 lg:pb-10 lg:pt-10">
          {/* Title row */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-xl bg-slate-200" />
              <Skeleton className="h-8 w-72 rounded-xl bg-slate-200 sm:w-96" />
              <Skeleton className="h-5 w-56 rounded-xl bg-slate-200" />
            </div>
            <Skeleton className="hidden h-11 w-11 shrink-0 rounded-full bg-slate-200 lg:block" />
          </div>

          {/* Image gallery */}
          <div className="hidden h-[460px] gap-1.5 lg:grid lg:grid-cols-3">
            <Skeleton className="col-span-2 h-full rounded-2xl bg-slate-200" />
            <div className="grid h-full grid-rows-2 gap-1.5">
              <Skeleton className="h-full rounded-2xl bg-slate-200" />
              <Skeleton className="h-full rounded-2xl bg-slate-200" />
            </div>
          </div>
          <Skeleton className="h-[56vw] max-h-[360px] min-h-[220px] rounded-2xl bg-slate-200 lg:hidden" />

          {/* Key highlights */}
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[52px] w-32 shrink-0 rounded-xl bg-slate-200"
              />
            ))}
          </div>

          {/* Main content + sidebar */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
            <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
              <Skeleton className="h-48 w-full rounded-2xl bg-slate-200" />
              <Skeleton className="h-72 w-full rounded-2xl bg-slate-200" />
              <Skeleton className="h-64 w-full rounded-2xl bg-slate-200" />
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <Skeleton className="h-56 w-full rounded-2xl bg-slate-200" />
              <Skeleton className="h-32 w-full rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailLoading;
