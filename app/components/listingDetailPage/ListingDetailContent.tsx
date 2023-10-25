import { Divider } from "@tremor/react";
import { useState } from "react";

type Prop = {
  generalInfo: {
    title: string;
    value: string;
  }[];
  areaAndCapacity: {
    title: string;
    value: string;
  }[];
  construction: {
    title: string;
    value: string;
  }[];
  heatingType: string;
  description: string;
}
const ListingDetailContent = ({
  generalInfo,
  areaAndCapacity,
  construction,
  heatingType,
  description,
}: Prop) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <>
      {description && (
        <>
          <div className="pb-6">
            <p className="text-2xl">Description</p>
            <p className="pt-4 text-gray-500 font-light" data-testid="description">
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
          <Divider className={"hidden lg:block"} />
        </>
      )}
      <div className="pb-6">
        <p className="text-2xl">General information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8 ">
          {generalInfo.map((item, index) => (
            <div key={index} className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div className="pb-6">
        <p className="text-2xl">Area and Capacity</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8">
          {areaAndCapacity?.map((item, index) => (
            <div key={index} className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div className="pb-6">
        <p className="text-2xl">Construction</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8">
          {construction?.map((item, index) => (
            <div key={index} className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div className="pb-6">
        <p className="text-2xl">Heating</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8">
          <div className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
            <p className="text-gray-500">Heating Type</p>
            <p>{heatingType || "-"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetailContent;
