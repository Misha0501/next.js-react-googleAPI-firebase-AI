"use client";

import { useCallback, useMemo } from "react";
import { PropertyTypeFilter } from "@/app/components/shared/PropertyTypeFilter";
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
import { RadioGroupCustom } from "../shared/RadioGroupCustom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  HomeModernIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  appendArraySearchParam,
  getArraySearchParam,
} from "@/app/lib/searchParamsArray";

type FilterSectionProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
};

const FilterSection = ({
  icon,
  title,
  description,
  children,
}: FilterSectionProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-4 flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-black text-[#1F2937]">{title}</h3>
        {description && (
          <p className="mt-1 text-xs leading-5 text-[#64748B]">{description}</p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const isActiveMin = (value?: string | number) =>
  value !== undefined && value !== "0" && value !== 0;

const isActiveMax = (value?: string | number) =>
  value !== undefined && value !== NO_MAX;

const isActiveListedSince = (value?: string | number) =>
  value !== undefined && value !== 0 && value !== "0";

export type RangeValue = string | number | undefined;

export type FilterValues = {
  listingType: string | undefined;
  propertyType: string[];
  priceRange: { min: RangeValue; max: RangeValue };
  livingAreaRange: { min: RangeValue; max: RangeValue };
  areaTotal: { min: RangeValue; max: RangeValue };
  roomRange: { min: RangeValue; max: RangeValue };
  bedroomRange: { min: RangeValue; max: RangeValue };
  listedSince: number | undefined;
};

type FiltersProps = {
  listingType: string;
  locality: string;
};

type FilterSearchParamsReader = Pick<URLSearchParams, "get" | "getAll">;

export const getFilterValuesFromSearchParams = (
  params: FilterSearchParamsReader,
  listingType: string,
): FilterValues => {
  return {
    listingType: listingType || undefined,
    propertyType: getArraySearchParam(params, "propertyType"),
    priceRange: {
      min: params.get("priceMin") || undefined,
      max: params.get("priceMax") || undefined,
    },
    livingAreaRange: {
      min: params.get("areaLivingMin") || undefined,
      max: params.get("areaLivingMax") || undefined,
    },
    areaTotal: {
      min: params.get("areaTotalMin") || undefined,
      max: params.get("areaTotalMax") || undefined,
    },
    roomRange: {
      min: params.get("roomsMin") || undefined,
      max: params.get("roomsMax") || undefined,
    },
    bedroomRange: {
      min: params.get("bedroomsMin") || undefined,
      max: params.get("bedroomsMax") || undefined,
    },
    listedSince: params.get("listedSince")
      ? Number(params.get("listedSince"))
      : undefined,
  };
};

export function Filters({ listingType, locality }: FiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const urlParams = useSearchParams();
  const urlQueryString = urlParams.toString();
  const filterValues = useMemo(
    () =>
      getFilterValuesFromSearchParams(
        new URLSearchParams(urlQueryString),
        listingType,
      ),
    [listingType, urlQueryString],
  );
  const filterKey = urlQueryString || "default";

  const buildUrl = useCallback(
    (filters: typeof filterValues) => {
      const qp = new URLSearchParams();
      if (locality) qp.set("locality", locality);
      if (listingType) qp.set("listingType", listingType);
      appendArraySearchParam(qp, "propertyType", filters.propertyType);
      if (filters.priceRange?.min && filters.priceRange.min !== "0")
        qp.set("priceMin", String(filters.priceRange.min));
      if (filters.priceRange?.max && filters.priceRange.max !== NO_MAX)
        qp.set("priceMax", String(filters.priceRange.max));
      if (filters.livingAreaRange?.min && filters.livingAreaRange.min !== "0")
        qp.set("areaLivingMin", String(filters.livingAreaRange.min));
      if (
        filters.livingAreaRange?.max &&
        filters.livingAreaRange.max !== NO_MAX
      )
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

  const hasActiveFilters = useMemo(() => {
    return (
      filterValues.propertyType?.length > 0 ||
      isActiveMin(filterValues.priceRange.min) ||
      isActiveMax(filterValues.priceRange.max) ||
      isActiveMin(filterValues.livingAreaRange.min) ||
      isActiveMax(filterValues.livingAreaRange.max) ||
      isActiveMin(filterValues.areaTotal.min) ||
      isActiveMax(filterValues.areaTotal.max) ||
      isActiveMin(filterValues.roomRange.min) ||
      isActiveMax(filterValues.roomRange.max) ||
      isActiveMin(filterValues.bedroomRange.min) ||
      isActiveMax(filterValues.bedroomRange.max) ||
      isActiveListedSince(filterValues.listedSince)
    );
  }, [filterValues]);

  const activeFilterCount = useMemo(() => {
    return [
      filterValues.propertyType?.length ? filterValues.propertyType.length : 0,
      isActiveMin(filterValues.priceRange.min) ? 1 : 0,
      isActiveMax(filterValues.priceRange.max) ? 1 : 0,
      isActiveMin(filterValues.livingAreaRange.min) ? 1 : 0,
      isActiveMax(filterValues.livingAreaRange.max) ? 1 : 0,
      isActiveMin(filterValues.areaTotal.min) ? 1 : 0,
      isActiveMax(filterValues.areaTotal.max) ? 1 : 0,
      isActiveMin(filterValues.roomRange.min) ? 1 : 0,
      isActiveMax(filterValues.roomRange.max) ? 1 : 0,
      isActiveMin(filterValues.bedroomRange.min) ? 1 : 0,
      isActiveMax(filterValues.bedroomRange.max) ? 1 : 0,
      isActiveListedSince(filterValues.listedSince) ? 1 : 0,
    ].reduce((count, value) => count + value, 0);
  }, [filterValues]);

  const clearFilters = useCallback(() => {
    const qp = new URLSearchParams();
    if (locality) qp.set("locality", locality);
    if (listingType) qp.set("listingType", listingType);
    router.replace(`${pathname}?${qp.toString()}`);
  }, [locality, listingType, pathname, router]);

  const applyFilters = useCallback(
    (newValues: typeof filterValues) => {
      const queryString = buildUrl(newValues);
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [buildUrl, pathname, router],
  );

  const handlePropertyTypeChange = useCallback(
    (values: string[]) => {
      applyFilters({ ...filterValues, propertyType: values });
    },
    [filterValues, applyFilters],
  );

  const handleLivingAreaChange = useCallback(
    (min: RangeValue, max: RangeValue) => {
      applyFilters({ ...filterValues, livingAreaRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleLivingLandChange = useCallback(
    (min: RangeValue, max: RangeValue) => {
      applyFilters({ ...filterValues, areaTotal: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handlePriceChange = useCallback(
    (min: RangeValue, max: RangeValue) => {
      applyFilters({ ...filterValues, priceRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleRoomChange = useCallback(
    (min: RangeValue, max: RangeValue) => {
      applyFilters({ ...filterValues, roomRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleBedroomChange = useCallback(
    (min: RangeValue, max: RangeValue) => {
      applyFilters({ ...filterValues, bedroomRange: { min, max } });
    },
    [filterValues, applyFilters],
  );

  const handleListedSince = useCallback(
    (value: string | number) => {
      const listedSince = Number(value);
      applyFilters({
        ...filterValues,
        listedSince: Number.isNaN(listedSince) ? undefined : listedSince,
      });
    },
    [filterValues, applyFilters],
  );

  const formatPriceFilterValue = (value: string | number) => {
    return value === NO_MAX ? NO_MAX : formatEuroPrice(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
        <div>
          <p className="text-sm font-black text-[#1F2937]">
            {activeFilterCount
              ? `${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}`
              : "No active filters"}
          </p>
          <p className="mt-0.5 text-xs text-[#64748B]">
            {listingType === "RENT" ? "Rental search" : "Purchase search"}
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#334155] transition hover:border-[#CFE0FF] hover:text-[#1F5FD6]"
          >
            Clear
          </button>
        )}
      </div>

      <FilterSection
        icon={<BanknotesIcon className="h-5 w-5" />}
        title="Price range"
        description={
          listingType === "RENT"
            ? "Monthly rent in euro"
            : "Asking price in euro"
        }
      >
        {listingType === "SELL" && (
          <FromToFilter
            key={"price-sell-" + filterKey}
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
            key={"price-rent-" + filterKey}
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
      </FilterSection>

      <FilterSection
        icon={<TagIcon className="h-5 w-5" />}
        title="Property type"
        description="Select one or more categories"
      >
        <PropertyTypeFilter
          key={"prop-type-" + filterKey}
          selectedValues={filterValues.propertyType}
          onChange={handlePropertyTypeChange}
          id={"propertyTypeFilter"}
        />
      </FilterSection>

      <FilterSection
        icon={<Squares2X2Icon className="h-5 w-5" />}
        title="Living area"
        description="Interior square meters"
      >
        <FromToFilter
          key={"living-area-" + filterKey}
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
      </FilterSection>

      <FilterSection
        icon={<Squares2X2Icon className="h-5 w-5" />}
        title="Property area"
        description="Total property or plot size"
      >
        <FromToFilter
          key={"area-total-" + filterKey}
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
      </FilterSection>

      <FilterSection
        icon={<HomeModernIcon className="h-5 w-5" />}
        title="Rooms"
        description="Total rooms in the property"
      >
        <FromToFilter
          key={"rooms-" + filterKey}
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
      </FilterSection>

      <FilterSection
        icon={<HomeModernIcon className="h-5 w-5" />}
        title="Bedrooms"
        description="Dedicated sleeping rooms"
      >
        <FromToFilter
          key={"bedrooms-" + filterKey}
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
      </FilterSection>

      <FilterSection
        icon={<CalendarDaysIcon className="h-5 w-5" />}
        title="Listed since"
        description="Focus on newer properties"
      >
        <RadioGroupCustom
          key={"listed-since-" + filterKey}
          options={listedSinceOptions}
          onChange={handleListedSince}
          id={"listedSinceFilter"}
          initialValue={filterValues.listedSince ?? null}
        />
      </FilterSection>
    </div>
  );
}

export default Filters;
