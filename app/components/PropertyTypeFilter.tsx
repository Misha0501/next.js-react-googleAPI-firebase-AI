"use client";
import { useState, useEffect } from "react";
import { Checkbox } from "@/app/components/Checkbox";
import { propertyTypesInitialState } from "../Constants/filters";

export function PropertyTypeFilter({ onChange, selectedValues }: any) {
  const handleCheckboxChange = (value: any) => {
    // Toggle the selected value in the state
    const updatedSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item: any) => item !== value)
      : [...selectedValues, value];

    // Call the parent's onChange callback with the updated selected values
    onChange(updatedSelectedValues);
  };

  return (
    <>
      {propertyTypesInitialState &&
        propertyTypesInitialState.map((item, index) => (
          <div className="flex items-center gap-3" key={item.value}>
            <Checkbox
              checked={selectedValues?.includes(item.value)}
              label={item.label}
              onChange={() => handleCheckboxChange(item.value)}
              value={item.value}
            />
          </div>
        ))}
    </>
  );
}
