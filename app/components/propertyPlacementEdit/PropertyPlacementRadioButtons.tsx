"use client";
import { RadioGroup } from "@headlessui/react";
import {
  CheckCircleIcon,
  HomeModernIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";

type PropertyPlacementRadioButtonsProps = {
  options: string[];
  onChange?: (item: any) => void;
  id: string;
  value?: any;
  defaultValue?: string;
};
export default function PropertyPlacementRadioButtons({
  options,
  onChange,
  id,
  value,
}: PropertyPlacementRadioButtonsProps) {
  const handleOnChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <RadioGroup value={value} onChange={handleOnChange}>
      <RadioGroup.Label className="sr-only">Listing type</RadioGroup.Label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((item) => {
          const Icon = item === "RENT" ? KeyIcon : HomeModernIcon;

          return (
            <RadioGroup.Option
              id={id}
              key={item}
              value={item}
              className={({ checked }) =>
                `relative cursor-pointer rounded-xl border p-4 outline-none transition ${
                  checked
                    ? "border-[#1F5FD6] bg-[#F6F9FF] shadow-sm"
                    : "border-slate-200 bg-white hover:border-[#CFE0FF] hover:bg-[#F8FAFC]"
                }`
              }
            >
              {({ checked }) => (
                <div className="flex min-h-[76px] items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        checked
                          ? "bg-[#1F5FD6] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <RadioGroup.Label
                        as="p"
                        className="text-sm font-bold text-[#1F2937]"
                      >
                        {item === "SELL" ? "Sell" : "Rent"}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="p"
                        className="mt-1 text-xs text-[#64748B]"
                      >
                        {item === "SELL"
                          ? "Find a buyer for the property"
                          : "Find a tenant for the property"}
                      </RadioGroup.Description>
                    </div>
                  </div>
                  {checked && (
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-[#1F5FD6]" />
                  )}
                </div>
              )}
            </RadioGroup.Option>
          );
        })}
      </div>
    </RadioGroup>
  );
}
