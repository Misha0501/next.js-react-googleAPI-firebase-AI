import { Divider } from "@tremor/react";
import { useState } from "react";

const ListingDetailContent = ({
  generalInfo,
  areaAndCapacity,
  construction,
  heatingType,
  description,
}) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      {description && (
        <>
          <div className="pb-6">
            <p className="text-[24px]">Description</p>
            <p className="text-[16px] pt-4 text-[#222222] font-light">
              {showMore
                ? description
                : `${description?.substring(0, 400)} .....`}
            </p>
            <p
              className="pt-12 font-bold underline cursor-pointer"
              onClick={() => setShowMore(!showMore)}
            >
              Show More
            </p>
          </div>
          <Divider />
        </>
      )}
      <div className="pb-6">
        <p className="text-[24px]">General information</p>
        <div className="grid grid-cols-2 gap-6 pt-8">
          {generalInfo.map((item, index) => (
            <div key={index} className="flex justify-between">
              <p className="text-[16px] text-[#848484]">{item.title}</p>
              <p className="text-[16px]">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="pb-6">
        <p className="text-[24px]">Area and Capacity</p>
        <div className="grid grid-cols-2 gap-6 pt-8">
          {areaAndCapacity?.map((item, index) => (
            <div key={index} className="flex justify-between">
              <p className="text-[16px] text-[#848484]">{item.title}</p>
              <p className="text-[16px]">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="pb-6">
        <p className="text-[24px]">Construction</p>
        <div className="grid grid-cols-2 gap-6 pt-8">
          {construction?.map((item, index) => (
            <div key={index} className="flex justify-between">
              <p className="text-[16px] text-[#848484]">{item.title}</p>
              <p className="text-[16px]">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="pb-6">
        <p className="text-[24px]">Heating</p>
        <div className="grid grid-cols-2 gap-6 pt-8">
          <div className="flex justify-between">
            <p className="text-[16px] text-[#848484]">Heating Type</p>
            <p className="text-[16px]">{heatingType || "-"}</p>
          </div>
        </div>
      </div>
      <Divider />
      <div className="pb-6">
        <p className="text-[24px]">Characteristics</p>
        <div className="grid grid-cols-2 gap-6 pt-8">
          <p className="text-[16px]">
            Balcony, lying/sitting bath, renewable energy, garden
          </p>
        </div>
      </div>
    </>
  );
};

export default ListingDetailContent;
