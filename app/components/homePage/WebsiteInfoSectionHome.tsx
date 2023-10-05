import React from "react";

function HomeWebsiteInfoSection() {
  return (
    <div className="bg-[#EDF0F7] py-12">
      <div className="max-w-screen-xl m-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-4 content-center justify-between max-h-fit lg:max-h-56 lg:h-56">
        <div className="flex  gap-2 lg:gap-4 flex-col">
          <h4 className="text-2xl font-bold text-center  text-[#2D3648]">
            3 years on the market
          </h4>
          <p className="text-lg font-normal text-center text-[#717D96]">
            Established and Thriving Since 2019
          </p>
        </div>
        <div className="flex gap-2 lg:gap-4 flex-col">
          <h4 className="text-2xl font-bold text-center  text-[#2D3648]">
            10 000 + happy renters
          </h4>
          <p className="text-lg font-normal text-center text-[#717D96]">
            10,000+ Satisfied Tenants and Counting
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
