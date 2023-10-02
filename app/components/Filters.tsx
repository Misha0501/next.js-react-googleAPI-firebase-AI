"use client";

import { useCallback, useEffect, useState } from "react";
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
  NO_MAX,
  priceRentMaxOptions,
  priceRentMinOptions,
  priceSellMaxOptions,
  priceSellMinOptions,
} from "../Constants/filters";

import { FromToFilter } from "./FromToFilter";
import { RadioGroupCustom } from "./RadioGroupCustom";
import { usePathname } from "next/navigation";

export function Filters({ onParamsChange, listingType }: any) {
  const pathname = usePathname();

  const [filterValues, setFilterValues] = useState({
    listingType: listingType || undefined, // Listing type filter
    propertyType: [], // Property type filter
    priceRange: { min: undefined, max: undefined }, // Property price filter
    livingAreaRange: { min: undefined, max: undefined }, // Square meters living area filter
    // livingLandRange: { min: undefined, max: undefined }, // Square meters property filter
    areaTotal: { min: undefined, max: undefined }, // Square meters total filter
    roomRange: { min: undefined, max: undefined }, // Rooms filter
    bedroomRange: { min: undefined, max: undefined }, // Bedrooms filter
    listedSince: undefined, // Listed since filter
  });
  const removeUndefinedAndNoMaxValues = (filters: any) => {
    // set max value in all filterValues properties to undefined if it's set to NO_MAX
    const result: any = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined) {
        result[key] = filters[key];
      }

      // remove undefined children from params[key]
      if (typeof result[key] === "object") {
        Object.keys(result[key]).forEach((childKey) => {
          const child = result[key][childKey];

          if (child === NO_MAX) {
            result[key][childKey] = undefined;
          }
        });
      }
    });

    return result;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setQueryParams = (queryParams: any) => {
    window.history.replaceState(null, "", `${pathname}?${queryParams}`);
  };

  // Define a function to generate query parameters based on filter values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateQueryParams = (filters: any) => {
    let queryParams = "";

    if (
      filters.propertyType !== undefined &&
      filters.propertyType?.length > 0
    ) {
      queryParams += `&propertyType=${JSON.stringify(filters.propertyType)}`;
    }

    if (
      filters.livingAreaRange?.min !== undefined &&
      filters.livingAreaRange?.min !== "0"
    ) {
      queryParams += `&areaLivingMin=${filters.livingAreaRange?.min}`;
    }

    if (
      filters.livingAreaRange?.max !== undefined &&
      filters.livingAreaRange?.max !== NO_MAX
    ) {
      queryParams += `&areaLivingMax=${filters.livingAreaRange?.max}`;
    }

    if (
      filters.areaTotal?.min !== undefined &&
      filters.areaTotal?.min !== "0"
    ) {
      queryParams += `&areaTotalMin=${filters.areaTotal?.min}`;
    }

    if (
      filters.areaTotal?.max !== undefined &&
      filters.areaTotal?.max !== NO_MAX
    ) {
      queryParams += `&areaTotalMax=${filters.areaTotal?.max}`;
    }

    if (
      filters.roomRange?.min !== undefined &&
      filters.roomRange?.min !== "0"
    ) {
      queryParams += `&roomsMin=${filters.roomRange?.min}`;
    }

    if (
      filters.roomRange?.max !== undefined &&
      filters.roomRange?.max !== NO_MAX
    ) {
      queryParams += `&roomsMax=${filters.roomRange?.max}`;
    }

    if (
      filters.bedroomRange?.min !== undefined &&
      filters.bedroomRange?.min !== "0"
    ) {
      queryParams += `&bedroomsMin=${filters.bedroomRange?.min}`;
    }

    if (
      filters.bedroomRange?.max !== undefined &&
      filters.bedroomRange?.max !== NO_MAX
    ) {
      queryParams += `&bedroomsMax=${filters.bedroomRange?.max}`;
    }

    if (
      filters.priceRange?.min !== undefined &&
      filters.priceRange?.min !== "0"
    ) {
      queryParams += `&priceMin=${filters.priceRange?.min}`;
    }

    if (
      filters.priceRange?.max !== undefined &&
      filters.priceRange?.max != NO_MAX
    ) {
      queryParams += `&priceMax=${filters.priceRange?.max}`;
    }

    if (filters?.listedSince !== undefined && filters?.listedSince !== "0") {
      queryParams += `&listedSince=${filters?.listedSince}`;
    }
    if (listingType !== "") {
      queryParams += `&listingType=${listingType}`;
    }

    return queryParams;
  };

  const handlePropertyTypeChange = useCallback(
    (values: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        propertyType: values,
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        propertyType: values,
      });
      setQueryParams(queryParams);
    },
    [filterValues, setFilterValues, generateQueryParams, setQueryParams]
  );

  const handleLivingAreaChange = useCallback(
    (min: any, max: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        livingAreaRange: { min, max },
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        livingAreaRange: { min, max },
      });
      setQueryParams(queryParams);
    },
    [filterValues, setFilterValues, generateQueryParams, setQueryParams]
  );

  const handleLivingLandChange = useCallback(
    (min: any, max: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        areaTotal: { min, max },
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        areaTotal: { min, max },
      });
      setQueryParams(queryParams);
    },
    [filterValues, setFilterValues, generateQueryParams, setQueryParams]
  );

  const handlePriceChange = useCallback(
    (min: any, max: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        priceRange: { min, max },
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        priceRange: { min, max },
      });
      setQueryParams(queryParams);
    },
    [filterValues, setFilterValues, generateQueryParams, setQueryParams]
  );

  const handleRoomChange = useCallback(
    (min: any, max: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        roomRange: { min, max },
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        roomRange: { min, max },
      });
      setQueryParams(queryParams);
    },
    [filterValues, setFilterValues, generateQueryParams, setQueryParams]
  );

  const handleBedroomChange = useCallback(
    (min: any, max: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        bedroomRange: { min, max },
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        bedroomRange: { min, max },
      });
      setQueryParams(queryParams);
    },
    [filterValues, setFilterValues, generateQueryParams, setQueryParams]
  );

  const handleListedSince = useCallback(
    (values: any) => {
      setFilterValues((prevFilterValues) => ({
        ...prevFilterValues,
        listedSince: values,
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        listedSince: values,
      });
      setQueryParams(queryParams);
    },
    [filterValues, setFilterValues, generateQueryParams, setQueryParams]
  );

  useEffect(() => {
    generateQueryParams(filterValues);
    onParamsChange(filterValues);
  }, [filterValues, generateQueryParams, onParamsChange]);

  return (
    <>
      <p className={"font-bold mb-4"}>Price Range </p>
      {/* {listingType === "SELL" && */}
      <FromToFilter
        valuesTo={priceRentMaxOptions}
        valuesFrom={priceRentMinOptions}
        initialFrom={filterValues.priceRange.min || "0"}
        initialTo={filterValues.priceRange.max || NO_MAX}
        onChangeFrom={(value) =>
          handlePriceChange(value, filterValues.priceRange.max)
        }
        onChangeTo={(value) =>
          handlePriceChange(filterValues.priceRange.min, value)
        }
      />
      {/*  } */}
      {/* {listingType === "RENT" &&
        <FromToFilter
          valuesTo={priceRentMaxOptions}
          valuesFrom={priceRentMinOptions}
          initialFrom={filterValues.priceRange.min || "0"}
          initialTo={filterValues.priceRange.max || NO_MAX}
          onChangeFrom={(value) =>
            handlePriceChange(value, filterValues.priceRange.max)
          }
          onChangeTo={(value) =>
            handlePriceChange(filterValues.priceRange.min, value)
          }
        />
      } */}
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Property type</p>
      <PropertyTypeFilter
        selectedValues={filterValues.propertyType}
        onChange={handlePropertyTypeChange}
      />
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>
        Square meters living area
      </p>
      <FromToFilter
        valuesTo={areaLivingMaxOptions}
        valuesFrom={areaLivingMinOptions}
        initialFrom={filterValues.livingAreaRange.min || "0"}
        initialTo={filterValues.livingAreaRange.max || NO_MAX}
        onChangeFrom={(value) =>
          handleLivingAreaChange(value, filterValues.livingAreaRange.max)
        }
        onChangeTo={(value) =>
          handleLivingAreaChange(filterValues.livingAreaRange.min, value)
        }
      ></FromToFilter>
      <Divider className="my-6" />
      <p className={"font-bold text-base mb-4"}>Square meters property</p>
      <FromToFilter
        initialFrom={filterValues.areaTotal.min || "0"}
        initialTo={filterValues.areaTotal.max || NO_MAX}
        valuesFrom={areaLandMinOptions}
        valuesTo={areaLandMaxOptions}
        onChangeFrom={(value) =>
          handleLivingLandChange(value, filterValues.areaTotal.max)
        }
        onChangeTo={(value) =>
          handleLivingLandChange(filterValues.areaTotal.min, value)
        }
      ></FromToFilter>
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Rooms</p>
      <FromToFilter
        initialFrom={filterValues.roomRange.min || "0"}
        initialTo={filterValues.roomRange.max || NO_MAX}
        valuesFrom={minRoomsOptions}
        valuesTo={maxRoomsOptions}
        onChangeFrom={(value) =>
          handleRoomChange(value, filterValues.roomRange.max)
        }
        onChangeTo={(value) =>
          handleRoomChange(filterValues.roomRange.min, value)
        }
      ></FromToFilter>
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Bedrooms</p>
      <FromToFilter
        initialFrom={filterValues.bedroomRange.min || "0"}
        initialTo={filterValues.bedroomRange.max || NO_MAX}
        valuesFrom={minBedroomsOptions}
        valuesTo={maxBedroomsOptions}
        onChangeFrom={(value) =>
          handleBedroomChange(value, filterValues.bedroomRange.max)
        }
        onChangeTo={(value) =>
          handleBedroomChange(filterValues.bedroomRange.min, value)
        }
      ></FromToFilter>
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Listed since</p>
      <RadioGroupCustom
        options={listedSinceOptions}
        onChange={handleListedSince}
      />
      <Divider className="my-6" />
    </>
  );
}

export default Filters;
