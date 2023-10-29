"use client";

import { Divider } from "@tremor/react";
import { useMemo, useState } from "react";
import { Listing } from "@/types";

type Prop = {
  listing: Listing;
};
export const ListingDetailContent = ({ listing }: Prop) => {
  const [showMore, setShowMore] = useState(false);

  const hasLongDescription = useMemo(() => {
    return listing?.description?.length > 400;
  } , [listing?.description]);

  // format description using to show only 400 characters if it is more than 400 characters
  const formattedDescription = useMemo(() => {
    return hasLongDescription
      ? listing?.description?.slice(0, 400) + "..."
      : listing?.description;
  }, [listing?.description]);

  let generalInfo = useMemo(
    () => [
      { title: "Price", value: listing?.price },
      { title: "Amount of Rooms", value: listing?.rooms },
      { title: "Offered Since", value: listing?.createdAt },
      { title: "Amount of bathrooms", value: listing?.bathrooms },
      { title: "Status", value: listing?.active },
      { title: "Amount of bedrooms", value: listing?.bedrooms },
      { title: "Interior", value: listing?.interiorType },
      { title: "Heating", value: listing?.heatingType },
      { title: "Upkeep", value: listing?.upkeepType },
      { title: "Parking area", value: listing?.parking },
      { title: "Floor", value: listing?.floorNumber },
      { title: "Balcony/terrace", value: listing?.balcony },
    ],
    [listing],
  );

  let areaAndCapacity = useMemo(
    () => [
      { title: "Total area", value: listing?.areaTotal },
      { title: "Outside area", value: listing?.areaOutside },
      { title: "Living area", value: listing?.areaLiving },
      { title: "Garden", value: listing?.areaGarden },
      { title: "Volume", value: listing?.volume },
      { title: "Garage", value: listing?.areaGarage },
    ],
    [listing],
  );

  let construction = useMemo(
    () => [
      { title: "Building type", value: listing?.buildingType },
      { title: "Year built", value: listing?.constructedYear },
      { title: "Number of Floor", value: listing?.numberOfFloorsProperty },
    ],
    [listing],
  );

  if (!listing) {
    return null;
  }

  return (
    <div className="lg:pt-12">
      {formattedDescription && (
        <>
          <div className={"py-8 lg:py-0"}>
            <p className="text-2xl">Description</p>
            <p
              className="pt-4 text-gray-500 font-light"
              data-testid="description"
            >
              {!showMore ? formattedDescription: listing?.description}
            </p>
            {!showMore && hasLongDescription && (
              <p
                className="pt-4 font-bold underline cursor-pointer"
                onClick={() => setShowMore(!showMore)}
                data-testid="showMoreBtn"
              >
                Show More
              </p>
            )}
          </div>
          <Divider className={"hidden lg:block"} />
        </>
      )}
      <div className={"pb-8 lg:pb-0"}>
      <p className="text-2xl">General information</p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-5 "
          data-testid={"generalInfo"}
        >
          {generalInfo.map((item, index) => (
            <div
              key={index}
              className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5"
            >
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div className={"pb-8 lg:pb-0"}>
      <p className="text-2xl">Area and Capacity</p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-5"
          data-testid={"areaAndCapacity"}
        >
          {areaAndCapacity?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5"
            >
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div className={"pb-8 lg:pb-0"}>
      <p className="text-2xl">Construction</p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-5"
          data-testid={"construction"}
        >
          {construction?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5"
            >
              <p className="text-gray-500">{item.title}</p>
              <p>{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
      <Divider className={"hidden lg:block"} />
      <div className={"pb-8 lg:pb-0"}>
      <p className="text-2xl">Heating</p>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4"
          data-testid={"heating"}
        >
          <div className="flex justify-between sm:border-0 border-b border-gray-200 sm:pb-0 pb-3.5">
            <p className="text-gray-500">Heating Type</p>
            <p>{listing?.heatingType || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
