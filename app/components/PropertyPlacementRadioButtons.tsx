import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";

type PropertyPlacementRadioButtonsProps = {
  options: string[];
  onChange: (item: any) => void;
};
export default function PropertyPlacementRadioButtons({
  options,
  onChange,
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
        <RadioGroup value={selectedValue} onChange={handleOnChange}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="flex flex-col gap-y-6">
            {options.map((item, index) => (
              <RadioGroup.Option
                key={index}
                value={item}
                className={({ active, checked }) =>
                  `
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 border-2 focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
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
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
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
