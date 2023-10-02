"use client";

export const RadioButton = ({
  id,
  label,
  checked,
  onChange,
  name,
  value,
}: any) => {
  return (
    <div className={"flex gap-x-3"}>
      <input
        className="h-5 w-5"
        type="radio"
        id={id}
        checked={checked}
        onChange={onChange}
        name={value}
      />
      {/*<input type="radio" id={id} name={name} value={value}/>*/}
      <label className={"text-[#2D3648] text-base font-normal"} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
