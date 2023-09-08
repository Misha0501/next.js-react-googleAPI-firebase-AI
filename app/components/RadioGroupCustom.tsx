import React, { useState } from "react";
import { RadioButton } from "@/app/components/RadioButton";

export const RadioGroupCustom = ({ options, onChange }) => {
  const [selectedValye, setSelectedValue] = useState(null);

  const handleOnChange = (value) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {options &&
        options.map((item, index) => (
          <RadioButton
            checked={item.value === selectedValye}
            key={index}
            label={item.label}
            id={index}
            value={item.value}
            onChange={() => handleOnChange(item.value)}
            name={"listedSince"}
          />
        ))}
    </div>
  );
};
