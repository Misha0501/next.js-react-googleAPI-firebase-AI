import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  options: { label: string; value: string | number }[];
  onChange?: (value: string | number) => void;
  id?: string;
  initialValue?: string | number | null;
};

export const RadioGroupCustom = ({
  options,
  onChange,
  id,
  initialValue = null,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | number | null>(
    initialValue,
  );

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const handleOnChange = (value: string | number) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  return (
    <div className="grid gap-2" id={id} role="radiogroup">
      {options.map((item, index) => {
        const isSelected = item.value === selectedValue;

        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            id={id ? `${id}${index}` : undefined}
            onClick={() => handleOnChange(item.value)}
            className={`min-h-11 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm font-bold transition ${
              isSelected
                ? "border-[#1F5FD6] bg-[#F6F9FF] text-[#1F5FD6]"
                : "border-slate-200 bg-white text-[#334155] hover:border-[#CFE0FF] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]"
            }`}
          >
            <span>{item.label}</span>
            {isSelected && <CheckCircleIcon className="h-5 w-5 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
