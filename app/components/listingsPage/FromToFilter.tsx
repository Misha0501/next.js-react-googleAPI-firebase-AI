import type { ReactNode } from "react";

const selectClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#1F2937] outline-none transition focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

type Props = {
  initialFrom: string | number;
  initialTo: string | number;
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
  const getLabel = (value: string | number) =>
    formatValue ? formatValue(value) : value;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <select
        value={String(initialFrom)}
        onChange={(e) => onChangeFrom(e.target.value)}
        id={id ? id + "Min" : undefined}
        className={selectClass}
      >
        {valuesFrom.map((item, index) => (
          <option value={String(item)} key={index}>
            {getLabel(item)}
          </option>
        ))}
      </select>
      <span className="text-xs font-bold uppercase text-[#94A3B8]">to</span>
      <select
        value={String(initialTo)}
        onChange={(e) => onChangeTo(e.target.value)}
        id={id ? id + "Max" : undefined}
        className={selectClass}
      >
        {valuesTo.map((item, index) => (
          <option value={String(item)} key={index}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
};
