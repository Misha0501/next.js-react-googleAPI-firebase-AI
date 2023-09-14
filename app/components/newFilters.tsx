"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PropertyTypeFilter } from "@/app/components/PropertyTypeFilter";
import { Divider } from "@tremor/react";
import {
  areaLandMaxOptions,
  areaLandMinOptions,
  areaLivingMaxOptions,
  areaLivingMinOptions,
  listedSinceOptions,
  maxBedroomsOptions,
  maxRoomsOptions,
  minBedroomsOptions,
  minRoomsOptions,
} from "../Constants/filters";

import { FromToFilter } from "./FromToFilter";
import { NO_MAX } from "../Constants/filters";
import { RadioGroupCustom } from "./RadioGroupCustom";

export function NewFilters({ onParamsChange }: any) {
  const [filterValues, setFilterValues] = useState({
    propertyType: [], // Property type filter
    livingAreaRange: { min: "0", max: 1000 }, // Square meters living area filter
    livingLandRange: { min: "0", max: 1000 }, // Square meters property filter
    roomRange: { min: "0", max: 1000 }, // Rooms filter
    bedroomRange: { min: "0", max: 1000 }, // Bedrooms filter
    listedSince: null, // Listed since filter
  });

  const handlePropertyTypeChange = useCallback(
    (values: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        propertyType: values,
      }));
    },
    [filterValues.propertyType]
  );
  const handleLivingAreaChange = useCallback(
    (min: string, max: string) => {
      if (min <= max) {
        setFilterValues((prevFilterValues) => ({
          ...prevFilterValues,
          livingAreaRange: { min, max },
        }));
        // You can also call onParamsChange or perform any other actions here
      } else {
        console.error("Invalid living area range");
      }
    },
    [filterValues.livingAreaRange]
  );
  const handleLivingLandChange = useCallback(
    (min: string, max: string) => {
      if (min <= max) {
        setFilterValues((prevFilterValues) => ({
          ...prevFilterValues,
          livingLandRange: { min, max },
        }));
        // You can also call onParamsChange or perform any other actions here
      } else {
        console.error("Invalid living area range");
      }
    },
    [filterValues.livingLandRange]
  );
  const handleRoomChange = useCallback(
    (min: string, max: string) => {
      if (min <= max) {
        setFilterValues((prevFilterValues) => ({
          ...prevFilterValues,
          roomRange: { min, max },
        }));
        // You can also call onParamsChange or perform any other actions here
      } else {
        console.error("Invalid living area range");
      }
    },
    [filterValues.roomRange]
  );
  const handleBedroomChange = useCallback(
    (min: string, max: string) => {
      if (min <= max) {
        setFilterValues((prevFilterValues) => ({
          ...prevFilterValues,
          bedroomRange: { min, max },
        }));
        // You can also call onParamsChange or perform any other actions here
      } else {
        console.error("Invalid living area range");
      }
    },
    [filterValues.bedroomRange]
  );
  const handleListedSince = useCallback(
    (values: null) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        listedSince: values,
      }));
    },
    [filterValues.listedSince]
  );

  useEffect(() => {
    onParamsChange(filterValues);
  }, [filterValues]);

  return (
    <>
      <p className={"font-bold mb-4"}>Property type</p>
      <PropertyTypeFilter
        selectedValues={filterValues.propertyType}
        onChange={handlePropertyTypeChange}
      />
      <Divider />
      <p className={"font-bold mb-4"}>Square meters living area</p>
      <FromToFilter
        valuesTo={areaLivingMaxOptions}
        valuesFrom={areaLivingMinOptions}
        initialFrom={filterValues.livingAreaRange.min}
        initialTo={filterValues.livingAreaRange.max}
        onChangeFrom={(value) =>
          handleLivingAreaChange(value, filterValues.livingAreaRange.max)
        }
        onChangeTo={(value) =>
          handleLivingAreaChange(filterValues.livingAreaRange.min, value)
        }
      ></FromToFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Square meters property</p>
      <FromToFilter
        initialFrom={filterValues.livingLandRange.min}
        initialTo={filterValues.livingLandRange.max}
        valuesFrom={areaLandMinOptions}
        valuesTo={areaLandMaxOptions}
        onChangeFrom={(value) =>
          handleLivingLandChange(value, filterValues.livingLandRange.max)
        }
        onChangeTo={(value) =>
          handleLivingLandChange(filterValues.livingLandRange.min, value)
        }
      ></FromToFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Rooms</p>
      <FromToFilter
        initialFrom={filterValues.roomRange.min}
        initialTo={filterValues.roomRange.max}
        valuesFrom={minRoomsOptions}
        valuesTo={maxRoomsOptions}
        onChangeFrom={(value) =>
          handleRoomChange(value, filterValues.roomRange.max)
        }
        onChangeTo={(value) =>
          handleRoomChange(filterValues.roomRange.min, value)
        }
      ></FromToFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Bedrooms</p>
      <FromToFilter
        initialFrom={filterValues.bedroomRange.min}
        initialTo={filterValues.bedroomRange.max}
        valuesFrom={minBedroomsOptions}
        valuesTo={maxBedroomsOptions}
        onChangeFrom={(value) =>
          handleBedroomChange(value, filterValues.bedroomRange.max)
        }
        onChangeTo={(value) =>
          handleBedroomChange(filterValues.bedroomRange.min, value)
        }
      ></FromToFilter>
      <Divider />
      <p className={"font-bold mb-4"}>Listed since</p>
      <RadioGroupCustom
        options={listedSinceOptions}
        onChange={handleListedSince}
      ></RadioGroupCustom>
      <Divider />
    </>
  );
}

export default NewFilters;
