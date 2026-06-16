"use client";

import { PROPERTY_TYPES } from "@/app/lib/constants";
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  HomeModernIcon,
  MapIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

type Props = {
  onChange: (value: string[]) => void;
  selectedValues: string[];
  id?: string;
};

const propertyTypeIcons = {
  HOUSE: HomeModernIcon,
  APARTMENT: BuildingOffice2Icon,
  PARKING: TruckIcon,
  LAND: MapIcon,
};

const labelize = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());

export function PropertyTypeFilter({
  onChange,
  selectedValues = [],
  id,
}: Props) {
  const handleCheckboxChange = (value: string) => {
    const updatedSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item: string) => item !== value)
      : [...selectedValues, value];

    onChange(updatedSelectedValues);
  };

  return (
    <div className="grid grid-cols-1 gap-2" id={id}>
      {PROPERTY_TYPES.map((item) => {
        const Icon = propertyTypeIcons[item] || HomeModernIcon;
        const isSelected = selectedValues?.includes(item);

        return (
          <button
            key={item}
            type="button"
            onClick={() => handleCheckboxChange(item)}
            className={`min-h-12 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
              isSelected
                ? "border-[#1F5FD6] bg-[#F6F9FF] text-[#1F5FD6]"
                : "border-slate-200 bg-white text-[#334155] hover:border-[#CFE0FF] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isSelected ? "bg-[#EAF2FF]" : "bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold">{labelize(item)}</span>
            </span>
            {isSelected && <CheckCircleIcon className="h-5 w-5 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
