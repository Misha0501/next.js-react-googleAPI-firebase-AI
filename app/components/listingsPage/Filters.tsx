"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@/app/lib/constants/filters";
import { FromToFilter } from "./FromToFilter";
import { RadioGroupCustom } from "../RadioGroupCustom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatEuroPrice } from "@/app/lib/formatPrice";

export function Filters({ onParamsChange, listingType, locality }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const urlParams = useSearchParams();

  const [filterValues, setFilterValues] = useState(() => {
    let propertyType: any[] = [];
    try {
      const raw = urlParams.get("propertyType");
      if (raw) propertyType = JSON.parse(raw);
    } catch {}

    return {
      listingType: listingType || undefined,
      propertyType,
      priceRange: {
        min: urlParams.get("priceMin") || undefined,
        max: urlParams.get("priceMax") || undefined,
      },
      livingAreaRange: {
        min: urlParams.get("areaLivingMin") || undefined,
        max: urlParams.get("areaLivingMax") || undefined,
      },
      areaTotal: {
        min: urlParams.get("areaTotalMin") || undefined,
        max: urlParams.get("areaTotalMax") || undefined,
      },
      roomRange: {
        min: urlParams.get("roomsMin") || undefined,
        max: urlParams.get("roomsMax") || undefined,
      },
      bedroomRange: {
        min: urlParams.get("bedroomsMin") || undefined,
        max: urlParams.get("bedroomsMax") || undefined,
      },
      listedSince: urlParams.get("listedSince") ? Number(urlParams.get("listedSince")) : undefined,
    };
  });

  const buildUrl = useCallback(
    (filters: typeof filterValues) => {
      const qp = new URLSearchParams();
      if (locality) qp.set("locality", locality);
      if (listingType) qp.set("listingType", listingType);
      if (filters.propertyType?.length)
        qp.set("propertyType", JSON.stringify(filters.propertyType));
      if (filters.priceRange?.min && filters.priceRange.min !== "0")
        qp.set("priceMin", String(filters.priceRange.min));
      if (filters.priceRange?.max && filters.priceRange.max !== NO_MAX)
        qp.set("priceMax", String(filters.priceRange.max));
      if (filters.livingAreaRange?.min && filters.livingAreaRange.min !== "0")
        qp.set("areaLivingMin", String(filters.livingAreaRange.min));
      if (filters.livingAreaRange?.max && filters.livingAreaRange.max !== NO_MAX)
        qp.set("areaLivingMax", String(filters.livingAreaRange.max));
      if (filters.areaTotal?.min && filters.areaTotal.min !== "0")
        qp.set("areaTotalMin", String(filters.areaTotal.min));
      if (filters.areaTotal?.max && filters.areaTotal.max !== NO_MAX)
        qp.set("areaTotalMax", String(filters.areaTotal.max));
      if (filters.roomRange?.min && filters.roomRange.min !== "0")
        qp.set("roomsMin", String(filters.roomRange.min));
      if (filters.roomRange?.max && filters.roomRange.max !== NO_MAX)
        qp.set("roomsMax", String(filters.roomRange.max));
      if (filters.bedroomRange?.min && filters.bedroomRange.min !== "0")
        qp.set("bedroomsMin", String(filters.bedroomRange.min));
      if (filters.bedroomRange?.max && filters.bedroomRange.max !== NO_MAX)
        qp.set("bedroomsMax", String(filters.bedroomRange.max));
      if (filters.listedSince && filters.listedSince !== 0)
        qp.set("listedSince", String(filters.listedSince));
      return qp.toString();
    },
    [locality, listingType],
  );

  const [clearKey, setClearKey] = useState(0);

  const defaultFilterValues = useMemo(() => ({
    listingType: listingType || undefined,
    propertyType: [],
    priceRange: { min: undefined, max: undefined },
    livingAreaRange: { min: undefined, max: undefined },
    areaTotal: { min: undefined, max: undefined },
    roomRange: { min: undefined, max: undefined },
    bedroomRange: { min: undefined, max: undefined },
    listedSince: undefined,
  }), [listingType]);

  const hasActiveFilters = useMemo(() => {
    return (
      filterValues.propertyType?.length > 0 ||
      filterValues.priceRange.min !== undefined ||
      filterValues.priceRange.max !== undefined ||
      filterValues.livingAreaRange.min !== undefined ||
      filterValues.livingAreaRange.max !== undefined ||
      filterValues.areaTotal.min !== undefined ||
      filterValues.areaTotal.max !== undefined ||
      filterValues.roomRange.min !== undefined ||
      filterValues.roomRange.max !== undefined ||
      filterValues.bedroomRange.min !== undefined ||
      filterValues.bedroomRange.max !== undefined ||
      filterValues.listedSince !== undefined
    );
  }, [filterValues]);

  const clearFilters = useCallback(() => {
    setFilterValues(defaultFilterValues);
    setClearKey((k) => k + 1);
    const qp = new URLSearchParams();
    if (locality) qp.set("locality", locality);
    if (listingType) qp.set("listingType", listingType);
    router.replace(`${pathname}?${qp.toString()}`);
  }, [defaultFilterValues, locality, listingType, pathname, router]);

  const applyFilters = useCallback(
    (newValues: typeof filterValues) => {
      setFilterValues(newValues);
      router.replace(`${pathname}?${buildUrl(newValues)}`);
    },
    [buildUrl, pathname, router],
  );

  const handlePropertyTypeChange = useCallback(
    (values: any) => {
      applyFilters({ ...filterValues, propertyType: values });
    },
    [filterValues, applyFilters],
  );

  const handleLivingAreaChange = useCallback(
    (min: any, max: any) => {
      applyFilters({ ...filterValues, livingAreaRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleLivingLandChange = useCallback(
    (min: any, max: any) => {
      applyFilters({ ...filterValues, areaTotal: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handlePriceChange = useCallback(
    (min: any, max: any) => {
      applyFilters({ ...filterValues, priceRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleRoomChange = useCallback(
    (min: any, max: any) => {
      applyFilters({ ...filterValues, roomRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleBedroomChange = useCallback(
    (min: any, max: any) => {
      applyFilters({ ...filterValues, bedroomRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleListedSince = useCallback(
    (value: any) => {
      applyFilters({ ...filterValues, listedSince: value });
    },
    [filterValues, applyFilters],
  );

  useEffect(() => {
    onParamsChange(filterValues);
  }, [filterValues, onParamsChange]);

  const formatPriceFilterValue = (value: string | number) => {
    return value === NO_MAX ? NO_MAX : formatEuroPrice(value);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold">Price Range</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-[#717D96] hover:text-[#2D3648] underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
      {listingType === "SELL" && (
        <FromToFilter
          key={"price-sell-" + clearKey}
          valuesTo={priceSellMaxOptions}
          valuesFrom={priceSellMinOptions}
          initialFrom={filterValues.priceRange.min || "0"}
          initialTo={filterValues.priceRange.max || NO_MAX}
          onChangeFrom={(value) =>
            handlePriceChange(value, filterValues.priceRange.max)
          }
          onChangeTo={(value) =>
            handlePriceChange(filterValues.priceRange.min, value)
          }
          formatValue={formatPriceFilterValue}
          id={"priceFilter"}
        />
      )}
      {listingType === "RENT" && (
        <FromToFilter
          key={"price-rent-" + clearKey}
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
          formatValue={formatPriceFilterValue}
          id={"priceFilter"}
        />
      )}
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Property type</p>
      <PropertyTypeFilter
        key={"prop-type-" + clearKey}
        selectedValues={filterValues.propertyType}
        onChange={handlePropertyTypeChange}
        id={"propertyTypeFilter"}
      />
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>
        Square meters living area
      </p>
      <FromToFilter
        key={"living-area-" + clearKey}
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
        id={"livingAreaRangeFilter"}
      />
      <Divider className="my-6" />
      <p className={"font-bold text-base mb-4"}>Square meters property</p>
      <FromToFilter
        key={"area-total-" + clearKey}
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
        id={"areaTotalFilter"}
      />
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Rooms</p>
      <FromToFilter
        key={"rooms-" + clearKey}
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
        id={"roomRangeFilter"}
      />
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Bedrooms</p>
      <FromToFilter
        key={"bedrooms-" + clearKey}
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
        id={"bedroomRangeFilter"}
      />
      <Divider className="my-6" />
      <p className={"font-bold mb-4 text-[#2D3648]"}>Listed since</p>
      <RadioGroupCustom
        key={"listed-since-" + clearKey}
        options={listedSinceOptions}
        onChange={handleListedSince}
        id={"listedSinceFilter"}
        initialValue={filterValues.listedSince ?? null}
      />
      <Divider className="my-6" />
    </>
  );
}

export default Filters;
