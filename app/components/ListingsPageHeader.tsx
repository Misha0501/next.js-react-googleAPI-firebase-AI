'use client'
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Button} from "@tremor/react";
import { SetStateAction, useState } from "react";
import Autocomplete from "@/app/components/Autocomplete";

export const ListingsPageHeader = ({onLocalityChange, initialLocality}:any) => {
    return (
        <header className="pb-10 pt-16">
            <div className="container flex items-center space-x-3 ">
                <div className="w-full flex items-center bg-white border-2 rounded-lg pl-3 h-[46px]">
                  <Autocomplete onLocalityChange={onLocalityChange} initialValue={initialLocality}/>
                </div>
            </div>
        </header>
    );
}