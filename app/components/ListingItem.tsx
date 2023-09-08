'use client';
import headerImg from '@/public/header-hero.jpg'
import Image from 'next/image'
import {HeartIcon as HeartIconSolid} from "@heroicons/react/24/solid";
import {HeartIcon as HeartIconOutline} from "@heroicons/react/24/outline";
import {Listing} from "@/types";
import {useRouter} from "next/navigation";

type ListingItemProps = {
    listingItem: Listing
    onSavedIconClick : (listingItem: Listing) => void
    isLoadingSavedListings: boolean
}

export const ListingItem = ({listingItem, onSavedIconClick, isLoadingSavedListings}: ListingItemProps) => {
    const router = useRouter()

    const goToListingPage = () => {
        router.push(`listings/${listingItem.id}`)
    }

    const getLabel = () => {
        return 'New'
    }

    const handleSavedIconClick = () => {
        if(onSavedIconClick) {
            onSavedIconClick(listingItem)
        }
    };

    return (
        <div className={"rounded-lg drop-shadow-2xl bg-white h-fit"}>
            <div className="image-wrapper relative cursor-pointer" onClick={goToListingPage}>
                {getLabel() && <div
                    className="px-6 py-1 absolute top-4 left-4 bg-green-500 rounded-lg text-white">{getLabel()}</div>}
                <Image
                    className={"h-full rounded-t-lg w-full object-cover"}
                    width={384}
                    height={240}
                    src={headerImg}
                    alt="Picture of the property"
                    placeholder="blur" // Optional blur-up while loading
                />
            </div>
            <div className="flex justify-between p-4 gap-2">
                <div className="flex flex-col w-full">
                    <div className="mb-4 cursor-pointer" onClick={goToListingPage}>
                        <div className="flex mb-1 items-baseline space-x-2">
                            <span className={"font-bold text-[#0071b3] text-xl"}>€ 120.000</span>
                            <span className={"text-gray-500 font-semibold"}>930 EUR / &#13217;</span>
                        </div>
                        <span className={"font-bold text-gray-500"}>Sofia, Center</span>
                    </div>
                    <div className="icons-row">
                        <div className="flex items-center gap-2 mb-4">
                            <HeartIconSolid className={"h-6 w-6 text-gray-500"}></HeartIconSolid>
                            <span className={"text-gray-500"}>{listingItem.areaLiving} m2</span>
                        </div>
                    </div>
                    <span className={"text-[#0071b3] font-base"}>Agent name</span>
                </div>
                {isLoadingSavedListings && "loading"}
                {!isLoadingSavedListings && <div onClick={handleSavedIconClick} className={"cursor-pointer"}>
                    {listingItem.savedListingId && <HeartIconSolid className={"h-8 w-8 text-gray-500"}/>}
                    {!listingItem.savedListingId && <HeartIconOutline className={"h-8 w-8 text-gray-500"}/>}
                </div>}
            </div>
        </div>
    );
}
