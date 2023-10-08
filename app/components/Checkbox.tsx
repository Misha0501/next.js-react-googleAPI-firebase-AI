type Props = {
  label: string;
  onChange: (value: any) => void;
  value: any;
  checked: boolean;
  id?: string;
}
export const Checkbox = ({ label, onChange, value, checked, id } : Props) => {
  return (
    <label className={"flex gap-x-3"}>
      <input
        className="w-5 h-5 rounded-sm"
        checked={checked}
        type="checkbox"
        onChange={onChange}
        value={value}
        id={id}
      />
      <p className="text-base font-normal text-[#2D3648]">{label}</p>
    </label>
  );
};
