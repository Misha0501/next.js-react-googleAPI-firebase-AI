import React from "react";

const ESTABLISHED_YEAR = 2019;

function HomeWebsiteInfoSection() {
  const yearsOnMarket = new Date().getFullYear() - ESTABLISHED_YEAR;

  return (
    <section className="border-b border-slate-200/80 bg-white py-14 lg:py-16">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 content-center justify-between gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
        <div className="flex flex-col gap-2 rounded-lg bg-[#F8FAFC] px-5 py-6">
          <h4 className="text-center text-2xl font-bold text-[#2D3648]">
            {yearsOnMarket} years on the market
          </h4>
          <p className="text-center text-base font-normal text-[#717D96]">
            Established and Thriving Since {ESTABLISHED_YEAR}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-[#F8FAFC] px-5 py-6">
          <h4 className="text-center text-2xl font-bold text-[#2D3648]">
            1.000 + happy customers
          </h4>
          <p className="text-center text-base font-normal text-[#717D96]">
            1.000+ Satisfied Tenants and Buyers
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-[#F8FAFC] px-5 py-6">
          <h4 className="text-center text-2xl font-bold text-[#2D3648]">
            Support from our agents
          </h4>
          <p className="text-center text-base font-normal text-[#717D96]">
            Agent-Backed Assistance Always Available
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomeWebsiteInfoSection;
