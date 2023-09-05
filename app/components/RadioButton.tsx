'use client';

export const RadioButton = ({ id, label, checked, onChange, name, value}) => {
    return (
        <div className={"flex gap-x-3"}>
            <input type="radio" id={id} checked={checked} onChange={onChange} name={value}/>
            {/*<input type="radio" id={id} name={name} value={value}/>*/}
            <label className={"flex gap-x-3"} htmlFor={id}>{label}</label>
        </div>
    );
}
