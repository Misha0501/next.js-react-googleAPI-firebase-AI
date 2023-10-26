"use client";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";

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
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleOnChange = (value: string) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full ">
        <RadioGroup value={value} onChange={handleOnChange}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="grid grid-cols-2 gap-y-6 rounded-lg px-2 py-2 border-2">
            {options.map((item, index) => (
              <RadioGroup.Option
                id={id}
                key={index}
                value={item}
                defaultValue={value}
                className={({ active, checked }) =>
                  `
                  ${checked ? "bg-[#4785FD]  text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 justify-center  focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {/* {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )} */}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
