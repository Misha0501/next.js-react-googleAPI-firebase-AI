import React from "react";

const ESTABLISHED_YEAR = 2019;

function HomeWebsiteInfoSection() {
  const yearsOnMarket = new Date().getFullYear() - ESTABLISHED_YEAR;

  return (
    <div className="bg-[#EDF0F7] py-16 lg:py-20">
      <div className="max-w-screen-xl m-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 content-center justify-between">
        <div className="flex  gap-2 lg:gap-4 flex-col">
          <h4 className="text-2xl font-bold text-center  text-[#2D3648]">
            {yearsOnMarket} years on the market
          </h4>
          <p className="text-lg font-normal text-center text-[#717D96]">
            Established and Thriving Since {ESTABLISHED_YEAR}
          </p>
        </div>
        <div className="flex gap-2 lg:gap-4 flex-col">
          <h4 className="text-2xl font-bold text-center  text-[#2D3648]">
            1.000 + happy renters
          </h4>
          <p className="text-lg font-normal text-center text-[#717D96]">
            1.000+ Satisfied Tenants and Counting
          </p>
        </div>
        <div className="flex gap-2 lg:gap-4 flex-col">
          <h4 className="text-2xl font-bold text-center  text-[#2D3648]">
            Support from our agents
          </h4>
          <p className="text-lg font-normal text-center text-[#717D96]">
            Agent-Backed Assistance Always Available
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeWebsiteInfoSection;
