import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Icon } from "@tremor/react";

type PropertyPlacementRadioButtonsProps = {
  options: string[];
  onChange?: (item: any) => void;
  id: string;
  value?: any;
  onBlur?: any;
};
export default function SingleSelectRadioButton({
  options,
  onChange,
  id,
  value,
  onBlur,
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
        <RadioGroup onBlur={onBlur} value={value} onChange={handleOnChange}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="">
            {options.map((item, index) => (
              <RadioGroup.Option
                id={id}
                key={index}
                value={item}
                defaultValue={value}
                className={({ active, checked }) =>
                  `
                  ${checked ? "bg-transperent " : "bg-white"}
                     cursor-pointer rounded-lg    focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="">
                      <div className="">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium border-2 w-full p-5 rounded-xl mb-5 ${
                              checked
                                ? "border-[#2C72F6] font-bold border-2"
                                : "text-[#222] border-[#ADADAD] "
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p>{item}</p>
                              {checked ? (
                                <Icon
                                  size="sm"
                                  className="font-bold"
                                  icon={CheckCircleIcon}
                                />
                              ) : null}
                            </div>
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
