'use client';
import {Tab} from '@headlessui/react'
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

import {classNames} from "@/app/lib/classNames";


window.initMap = function (e) {
    console.log(e)
    console.log("in init map")
}

export function HomeHeroHeaderSearch() {
    const [listingTypeSelectedIndex, setListingTypeSelectedIndex] = useState(0)
    const [listingTypeSelected, setListingTypeSelected] = useState('SELL')
    const [selectedLocality, setSelectedLocality] = useState('')
    const router = useRouter()

    let [popularSearches] = useState(
        [
            {
                locality: 'Sofia',
                href: 'sofia',
            },
            {
                locality: 'Plovdiv',
                href: 'plovdiv',
            },
            {
                locality: 'Varna',
                href: 'varna',
            },
            {
                locality: 'Burgas',
                href: 'burgas',
            },
            {
                locality: 'Ruse',
                href: 'ruse',
            },
            {
                locality: 'Pleven',
                href: 'pleven',
            },
            {
                locality: 'Silven',
                href: 'silven',
            },

        ]
    )

    const autoCompleteRef = useRef();
    const inputRef = useRef();
    const options = {
        componentRestrictions: {country: "bg"},
        fields: ["address_components", "geometry", "icon", "name"],
        types: ["(cities)"]
    };

    useEffect(() => {
        // if(windw)
        if(window.google ) {
            autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);
        }
    }, [window.google]);

    useEffect(() => {
        setListingTypeSelected(listingTypeSelectedIndex === 0 ? 'SELL' : 'RENT')
    }, [listingTypeSelectedIndex]);

    const handleSubmit = (e) => {
        e.preventDefault()
        router.push(`/listings?listingType=${listingTypeSelected}&locality=${selectedLocality}`)
    }

    return (
        <>
            <form className={"flex flex-col justify-center items-center"} onSubmit={handleSubmit}>
                <Tab.Group selectedIndex={listingTypeSelectedIndex} onChange={setListingTypeSelectedIndex}>
                    <Tab.List
                        className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-5 w-full max-w-[300px] text-black">
                        <Tab
                            className={({selected}) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                    'ring-white ring-opacity-60 focus:outline-none ',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-gray-100 bg-white/[0.12] text-white'
                                )
                            }
                        >
                            Buy
                        </Tab>
                        <Tab
                            className={({selected}) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                    'ring-white ring-opacity-60 focus:outline-none ',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-gray-100 bg-white/[0.12] text-white'
                                )
                            }
                        >
                            Rent
                        </Tab>
                    </Tab.List>
                </Tab.Group>

                <div className="relative max-w-2xl w-full flex items-center mb-10">
                    <input className="hero__search w-full p-3 pl-8 rounded-l-lg outline-0 focus:outline-none text-black"
                           type={'text'}
                           placeholder={"E.g: Sophia, Plovdiv, Varna"}
                           onChange={event => setSelectedLocality(event.target.value)}
                    />
                    <button type={"submit"} className="p-3 bg-gray-200 rounded-r-lg">
                        <MagnifyingGlassIcon className={"h-6 w-6 text-gray-600"}/>
                    </button>
                </div>
                <div className="relative max-w-2xl w-full flex items-center mb-10">
                    <input className="hero__search w-full p-3 pl-8 rounded-l-lg outline-0 focus:outline-none text-black"
                           type={'text'}
                           placeholder={"E.g: Sophia, Plovdiv, Varna"}
                           onChange={event => setSelectedLocality(event.target.value)}
                           ref={inputRef}
                    />

                    {/*<Autocomplete className="hero__search w-full p-3 pl-8 rounded-l-lg outline-0 focus:outline-none text-black"></Autocomplete>*/}
                    <button type={"submit"} className="p-3 bg-gray-200 rounded-r-lg">
                        <MagnifyingGlassIcon className={"h-6 w-6 text-gray-600"}/>
                    </button>
                </div>
                <div className="hero__popular-searches">
                    <div className={"font-bold mb-2 text-xl"}>Popular searches</div>
                    <div className="space-x-3">
                        {popularSearches.map((item) => (
                            <Link
                                key={item.href}
                                href={`listings?locality=${item.locality}&listingType=${selectedLocality}`}
                                className={"hover:underline"}
                            >
                                {item.locality}
                            </Link>
                        ))}
                    </div>
                </div>
                <button type={"submit"} hidden>Search</button>
            </form>
        </>

    )
}
