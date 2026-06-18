import { Skeleton } from "@/app/components/shared/Skeleton";

const ProfileTabLoading = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 lg:pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <Skeleton className="h-4 w-32 rounded-xl bg-slate-200" />
              <Skeleton className="h-9 w-72 rounded-xl bg-slate-200 sm:h-10" />
              <Skeleton className="h-5 w-full max-w-md rounded-xl bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[72px] rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8 lg:px-8 lg:py-8">
        <aside className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5">
              <Skeleton className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-xl bg-slate-200" />
                <Skeleton className="h-3 w-1/2 rounded-xl bg-slate-200" />
              </div>
            </div>
            <div className="space-y-2 p-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-11 w-full rounded-xl bg-slate-200"
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl bg-slate-200" />
          <Skeleton className="h-40 w-full rounded-2xl bg-slate-200" />
          <Skeleton className="h-40 w-full rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default ProfileTabLoading;
