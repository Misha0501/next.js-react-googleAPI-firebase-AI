'use client';
import {useState} from "react";
import {Checkbox} from "@/app/components/Checkbox";


export function PropertyTypeFilter({ filters, handleChange }) {
    const [propertyTypes, setPropertyTypes] = useState(filters);

    const handleOnChange = async (e) => {
        let dbId = e.target.name;
        let checked = e.target.checked;

        const updateValues = [...propertyTypes.map(value => {
            if (value.dbId !== dbId) return value;
            value.checked = checked;
            return value;
        })];

        handleChange(propertyTypes);

        setPropertyTypes(updateValues);
    }

    return (
        <>
            {propertyTypes && propertyTypes.map((item, index) => (
                <div className="flex items-center gap-3" key={item.dbId}>
                    <Checkbox checked={item.checked}
                              label={item.label}
                              onChange={handleOnChange}
                              name={item.dbId}/>
                </div>
            ))}
        </>

    )
}
