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
    <div className="flex justify-center items-center gap-6">
      <Select
        value={String(initialFrom)}
        onValueChange={onChangeFrom}
        id={id ? id + "Min" : ""}
      >
        {valuesFrom.map((item, index) => (
          <SelectItem value={String(item)} key={index}>
            {getLabel(item)}
          </SelectItem>
        ))}
      </Select>
      <span>to</span>
      <Select
        value={String(initialTo)}
        onValueChange={onChangeTo}
        className={"text-sm"}
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
