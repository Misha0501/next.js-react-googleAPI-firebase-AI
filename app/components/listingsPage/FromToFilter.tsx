"use client";
import { Select, SelectItem } from "@tremor/react";

export const FromToFilter = ({
  initialFrom,
  initialTo,
  onChangeFrom,
  onChangeTo,
  valuesFrom,
  valuesTo,
}) => {
  return (
    <div className="flex justify-center items-center gap-6">
      <Select value={initialFrom} onValueChange={onChangeFrom}>
        {valuesFrom.map((item, index) => (
          <SelectItem value={item} key={index}>
            {item}
          </SelectItem>
        ))}
      </Select>
      <span>to</span>
      <Select
        value={initialTo}
        onValueChange={onChangeTo}
        className={"text-sm"}
      >
        {valuesTo.map((item, index) => (
          <SelectItem value={item} key={index}>
            {item}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
