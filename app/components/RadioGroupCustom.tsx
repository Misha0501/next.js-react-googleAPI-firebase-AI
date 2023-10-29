import React, { useState } from "react";
import { RadioButton } from "@/app/components/RadioButton";

type Props = {
  options: { label: string; value: string | number }[];
  onChange?: (value: string) => void;
  id?: string;
};
export const RadioGroupCustom = ({ options, onChange, id }: Props) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleOnChange = (value: any) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-2" id={id}>
      {options &&
        options.map((item, index) => (
          <RadioButton
            checked={item.value === selectedValue}
            key={index}
            label={item.label}
            id={id ? id + index : ""}
            value={item.value}
            onChange={() => handleOnChange(item.value)}
            name={"listedSince"}
          />
        ))}
    </div>
  );
};
