import { Select, SelectItem } from "@tremor/react";

type Props = {
  initialFrom: string;
  initialTo: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  valuesFrom: (string | number)[];
  valuesTo: (string | number)[];
  id?: string;
}
export const FromToFilter = ({
  initialFrom,
  initialTo,
  onChangeFrom,
  onChangeTo,
  valuesFrom,
  valuesTo,
  id,
}: Props) => {
  return (
    <div className="flex justify-center items-center gap-6">
      <Select value={initialFrom} onValueChange={onChangeFrom} id={id ? id + 'Min' : ''}>
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
        id={id ? id + 'Max' : ''}
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
