import React from "react";
import { FormikProps } from "formik";
import { EditPropertyValues } from "./types";

export const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

export const ErrorText = ({ children }: { children?: React.ReactNode }) => {
  if (!children) return null;
  return <p className="mt-2 text-sm font-semibold text-red-600">{children}</p>;
};

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

export const SectionRow = ({
  icon,
  title,
  description,
  children,
}: SectionProps) => (
  <section className="grid gap-5 border-b border-slate-200 py-8 last:border-b-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
        {icon}
      </span>
      <div>
        <h3 className="text-xl font-bold text-[#1F2937]">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">
          {description}
        </p>
      </div>
    </div>
    <div>{children}</div>
  </section>
);

type NumberFieldProps = {
  formik: FormikProps<EditPropertyValues>;
  name: keyof EditPropertyValues;
  label: string;
  unit?: string;
  min?: number;
  max?: number;
  error?: string;
};

export const NumberField = ({
  formik,
  name,
  label,
  unit,
  min = 0,
  max,
  error,
}: NumberFieldProps) => (
  <div>
    <label
      className="mb-2 block text-sm font-bold text-[#1F2937]"
      htmlFor={name}
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type="number"
        min={min}
        max={max}
        value={(formik.values[name] ?? "") as string | number}
        onChange={(event) =>
          formik.setFieldValue(
            name,
            event.target.value === "" ? undefined : Number(event.target.value),
            true,
          )
        }
        onBlur={formik.handleBlur}
        className={`${inputClass} ${unit ? "pr-12" : ""}`}
        placeholder="0"
      />
      {unit && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
          {unit}
        </span>
      )}
    </div>
    <ErrorText>{error}</ErrorText>
  </div>
);
