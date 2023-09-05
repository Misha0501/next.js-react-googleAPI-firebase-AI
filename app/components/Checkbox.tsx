'use client';

export const Checkbox = ({ label, checked, onChange, name}) => {
    return (
        <label className={"flex gap-x-3"}>
            <input type="checkbox" checked={checked} onChange={onChange} name={name}/>
            {label}
        </label>
    );
}
