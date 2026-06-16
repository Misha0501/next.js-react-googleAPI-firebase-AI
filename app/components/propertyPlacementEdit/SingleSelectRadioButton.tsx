import type { FocusEventHandler } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type PropertyPlacementRadioButtonsProps = {
  options: string[];
  onChange?: (item: string) => void;
  id: string;
  value?: string;
  onBlur?: FocusEventHandler;
};
const SingleSelectRadioButton = ({
  options,
  onChange,
  id,
  value,
  onBlur,
}: PropertyPlacementRadioButtonsProps) => {
  const handleOnChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <RadioGroup onBlur={onBlur} value={value} onChange={handleOnChange}>
      <RadioGroup.Label className="sr-only">Select one option</RadioGroup.Label>
      <div className="grid gap-3">
        {options.map((item) => (
          <RadioGroup.Option
            id={id}
            key={item}
            value={item}
            className={({ checked }) =>
              `cursor-pointer rounded-xl border p-4 outline-none transition ${
                checked
                  ? "border-[#1F5FD6] bg-[#F6F9FF] shadow-sm"
                  : "border-slate-200 bg-white hover:border-[#CFE0FF] hover:bg-[#F8FAFC]"
              }`
            }
          >
            {({ checked }) => (
              <div className="flex items-center justify-between gap-4">
                <RadioGroup.Label
                  as="span"
                  className="text-sm font-bold text-[#1F2937]"
                >
                  {item}
                </RadioGroup.Label>
                {checked && (
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-[#1F5FD6]" />
                )}
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default SingleSelectRadioButton;
