"use client";

export const Checkbox = ({ label, onChange, value, checked }) => {
  return (
    <label className={"flex gap-x-3"}>
      <input
        className="w-5 h-5 rounded-sm"
        checked={checked}
        type="checkbox"
        onChange={onChange}
        value={value}
      />
      <p className="text-base font-normal text-[#2D3648]">{label}</p>
    </label>
  );
};
