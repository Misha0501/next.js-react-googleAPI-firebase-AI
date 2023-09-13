'use client'
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Button} from "@tremor/react";
import { SetStateAction, useState } from "react";

export const ListingsPageHeader = ({onLocaltyChange}:any) => {
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setInputValue(e.target.value);
      };
    
      const handleButtonClick = () => {
        onLocaltyChange(inputValue)
      
      };
    return (
        <header className="pb-10 pt-16">
            <div className="container flex items-center space-x-3 ">
                <div className="w-full flex items-center bg-white border-2 rounded-lg pl-3 h-[46px]">
                    <MagnifyingGlassIcon className={"h-6 w-6 text-gray-600"}/>
                    <input className="hero__search w-full h-full pl-3 focus:outline-none rounded-r-lg text-black"
                           type={'text'}
                           placeholder={"E.g: Sophia, Plovdiv, Varna"}
                           value={inputValue} // Set the input value from state
                           onChange={handleInputChange} 
                    />
                </div>
                <Button onClick={handleButtonClick} icon={MagnifyingGlassIcon} size="lg" className={"w-[225px] space-x-3"}>Search</Button>
            </div>
        </header>
    );
}