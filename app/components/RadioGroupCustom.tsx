'use client';
import {useEffect, useState} from "react";
import {RadioButton} from "@/app/components/RadioButton";

export const RadioGroupCustom = ({options, onChange}) => {
    const [values, setValues] = useState(options);

    const handleOnChange = async (e) => {
        let value = e.target.value;
        let checked = e.target.checked;
        // let dbId = e.target.name;
        // let checked = e.target.checked;

        const updateValues = [...values.map((item, index) => {
            if(index === 0) {
                item.checked = false;
            }
            if(index === 3) {
                item.checked = true;
            }

            return item;
            if (item.value !== value) return item;
            item.checked = checked;
            return item;
        })];

        // onChange(values);

        setValues(updateValues);
    }

    useEffect(() => {

    },[values])

    return (
        <div className="flex flex-col gap-y-2">
            {values && values.map((item, index) => (
                <RadioButton checked={item.checked}
                             key={index}
                             label={item.label}
                             id={index}
                             value={item.value}
                             onChange={handleOnChange}
                             name={"listedSince"}/>
            ))}
        </div>
    );
}
