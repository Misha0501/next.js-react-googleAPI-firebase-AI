"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PropertyTypeFilter } from "@/app/components/PropertyTypeFilter";
import { Divider } from "@tremor/react";
import {
  NO_MAX,
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
import { RadioGroupCustom } from "./RadioGroupCustom";
import { useParams, usePathname, useSearchParams } from "next/navigation";

export function Filters({ onParamsChange, localty }: any) {
  const pathname = usePathname();
  const params = useSearchParams();

  const [listingType, setListingType] = useState(
    params.get("listingType") || ""
  );

  const [filterValues, setFilterValues] = useState({
    propertyType: undefined, // Property type filter
    livingAreaRange: { min: undefined, max: undefined }, // Square meters living area filter
    livingLandRange: { min: undefined, max: undefined }, // Square meters property filter
    roomRange: { min: undefined, max: undefined }, // Rooms filter
    bedroomRange: { min: undefined, max: undefined }, // Bedrooms filter
    listedSince: undefined, // Listed since filter
  });
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
      filters.livingLandRange?.min !== undefined &&
      filters.livingLandRange?.min !== "0"
    ) {
      queryParams += `&areaLandMin=${filters.livingLandRange?.min}`;
    }

    if (
      filters.livingLandRange?.max !== undefined &&
      filters.livingLandRange?.max !== NO_MAX
    ) {
      queryParams += `&areaLandMax=${filters.livingLandRange?.max}`;
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
        livingLandRange: { min, max },
      }));
      const queryParams = generateQueryParams({
        ...filterValues,
        livingLandRange: { min, max },
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
    onParamsChange(filterValues);
  }, [filterValues, onParamsChange]);

  //   useEffect(() => {
  //     const queryParams = generateQueryParams({
  //       ...filterValues,
  //       listingType: listingType,
  //     });
  //     setQueryParams(queryParams);
  //   }, [listingType]);

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
        initialFrom={filterValues.livingAreaRange.min || "0"}
        initialTo={filterValues.livingAreaRange.max || NO_MAX}
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
        initialFrom={filterValues.livingLandRange.min || "0"}
        initialTo={filterValues.livingLandRange.max || NO_MAX}
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
      <Divider />
      <p className={"font-bold mb-4"}>Bedrooms</p>
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

export default Filters;
