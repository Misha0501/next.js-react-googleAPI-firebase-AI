import React from "react";

const ESTABLISHED_YEAR = 2019;

const stats = [
  {
    value: `${new Date().getFullYear() - ESTABLISHED_YEAR}+`,
    label: "Years on market",
    sub: `Established since ${ESTABLISHED_YEAR}`,
  },
  {
    value: "1,000+",
    label: "Happy customers",
    sub: "Satisfied tenants and buyers",
  },
  {
    value: "24/7",
    label: "Agent support",
    sub: "Always backed by our agents",
  },
];

function HomeWebsiteInfoSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-14 lg:py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-white px-8 py-10"
            >
              <p className="text-4xl font-black text-[#1F5FD6]">{stat.value}</p>
              <p className="mt-2 text-base font-bold text-[#1E293B]">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-[#64748B]">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeWebsiteInfoSection;
