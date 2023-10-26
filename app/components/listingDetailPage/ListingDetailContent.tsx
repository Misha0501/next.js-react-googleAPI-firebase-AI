import { Divider } from "@tremor/react";
import { useMemo, useState } from "react";

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

  // format description using to show only 400 characters if it is more than 400 characters
  const formattedDescription = useMemo(() => {
    return description?.length > 400 ? description?.slice(0, 400) + "..." : description;
  }, [description]);

  return (
    <>
      {description && (
        <>
          <div>
            <p className="text-2xl">Description</p>
            <p className="pt-4 text-gray-500 font-light" data-testid="description">
              {showMore
                ? description
                : formattedDescription}
            </p>
            {!showMore && (
              <p
                className="pt-4 font-bold underline cursor-pointer"
                onClick={() => setShowMore(!showMore)}
                data-testid="showMoreBtn"
              >
                Show More
              </p>)
            }

          </div>
          <Divider className={"hidden lg:block"} />
        </>
      )}
      <div>
        <p className="text-2xl">General information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8 " data-testid={'generalInfo'}>
          {generalInfo.map((item, index) => (
            <div key={index} className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div>
        <p className="text-2xl">Area and Capacity</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8" data-testid={'areaAndCapacity'}>
          {areaAndCapacity?.map((item, index) => (
            <div key={index} className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div>
        <p className="text-2xl">Construction</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8" data-testid={'construction'}>
          {construction?.map((item, index) => (
            <div key={index} className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div>
        <p className="text-2xl">Heating</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-8" data-testid={'heating'}>
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
