"use client";

export const Checkbox = ({ label, onChange, value, checked }) => {
  return (
    <label className={"flex gap-x-3"}>
      <input
        checked={checked}
        type="checkbox"
        onChange={onChange}
        value={value}
      />
      {label}
    </label>
  );
};
