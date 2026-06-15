import { Select, SelectItem } from "@tremor/react";
import type { ReactNode } from "react";

type Props = {
  initialFrom: string;
  initialTo: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  valuesFrom: (string | number)[];
  valuesTo: (string | number)[];
  formatValue?: (value: string | number) => ReactNode;
  id?: string;
};
export const FromToFilter = ({
  initialFrom,
  initialTo,
  onChangeFrom,
  onChangeTo,
  valuesFrom,
  valuesTo,
  formatValue,
  id,
}: Props) => {
  const getLabel = (value: string | number) => {
    return formatValue ? formatValue(value) : value;
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <Select
        value={String(initialFrom)}
        onValueChange={onChangeFrom}
        id={id ? id + "Min" : ""}
        className="w-full"
      >
        {valuesFrom.map((item, index) => (
          <SelectItem value={String(item)} key={index}>
            {getLabel(item)}
          </SelectItem>
        ))}
      </Select>
      <span className="text-xs font-bold uppercase text-[#94A3B8]">to</span>
      <Select
        value={String(initialTo)}
        onValueChange={onChangeTo}
        className="w-full text-sm"
        id={id ? id + "Max" : ""}
      >
        {valuesTo.map((item, index) => (
          <SelectItem value={String(item)} key={index}>
            {getLabel(item)}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
