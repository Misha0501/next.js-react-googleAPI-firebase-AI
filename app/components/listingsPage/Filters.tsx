"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PropertyTypeFilter } from "@/app/components/PropertyTypeFilter";
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
import {
  BanknotesIcon,
  CalendarDaysIcon,
  HomeModernIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/outline";

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
      listedSince: urlParams.get("listedSince")
        ? Number(urlParams.get("listedSince"))
        : undefined,
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

  const [clearKey, setClearKey] = useState(0);
  const hasMounted = useRef(false);

  const defaultFilterValues = useMemo(
    () => ({
      listingType: listingType || undefined,
      propertyType: [],
      priceRange: { min: undefined, max: undefined },
      livingAreaRange: { min: undefined, max: undefined },
      areaTotal: { min: undefined, max: undefined },
      roomRange: { min: undefined, max: undefined },
      bedroomRange: { min: undefined, max: undefined },
      listedSince: undefined,
    }),
    [listingType],
  );

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setFilterValues(defaultFilterValues);
    setClearKey((key) => key + 1);
  }, [defaultFilterValues]);

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
      </FilterSection>

      <FilterSection
        icon={<TagIcon className="h-5 w-5" />}
        title="Property type"
        description="Select one or more categories"
      >
        <PropertyTypeFilter
          key={"prop-type-" + clearKey}
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
      </FilterSection>

      <FilterSection
        icon={<Squares2X2Icon className="h-5 w-5" />}
        title="Property area"
        description="Total property or plot size"
      >
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
      </FilterSection>

      <FilterSection
        icon={<HomeModernIcon className="h-5 w-5" />}
        title="Rooms"
        description="Total rooms in the property"
      >
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
      </FilterSection>

      <FilterSection
        icon={<HomeModernIcon className="h-5 w-5" />}
        title="Bedrooms"
        description="Dedicated sleeping rooms"
      >
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
      </FilterSection>

      <FilterSection
        icon={<CalendarDaysIcon className="h-5 w-5" />}
        title="Listed since"
        description="Focus on newer properties"
      >
        <RadioGroupCustom
          key={"listed-since-" + clearKey}
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
