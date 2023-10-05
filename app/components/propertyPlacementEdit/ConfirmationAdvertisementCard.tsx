import React from "react";

function ConfirmationAdvertisementCard({
  title,
  viewCount,
  description,
  pricing,
}: any) {
  return (
    <div className="mx-4 py-5 flex rounded-lg border border-[#ADADAD]">
      <div className="grid content-center p-4">
        <input
          type="checkbox"
          value=""
          className="w-6 h-6 text-[#4785FD]  rounded-[3px]"
        />
      </div>
      <div className="pl-4 flex flex-col gap-4 ">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-sm font-semibold">{viewCount}</p>
        <p className="text-sm font-normal">{description}</p>
        <p className="text-base font-semibold">{pricing}</p>
      </div>
    </div>
  );
}

export default ConfirmationAdvertisementCard;
