'use client';
import {useEffect, useState} from "react";
import {useFiltersStore} from "@/store/Filters";
import {ListingItem} from "@/app/components/ListingItem";
import {useRouter} from "next/navigation";

export const ListingsMain = ({label, checked, onChange, name}) => {
    const propertyTypesSearchQuery = useFiltersStore((state) => state.propertyTypesSearchQuery)
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalListings, setTotalListings] = useState(0);
    const router = useRouter()


    useEffect(() => {
        const url = `api/listings?${propertyTypesSearchQuery.toString()}`;
        console.log("url")
        console.log(url)
        const fetchListings = async () => {
            const response = await fetch(url, {cache: "no-store"});
            return await response.json();
        }
        fetchListings().then(data => {
            console.log("data")
            console.log(data)
            setListings(data.results)
            setPage(data.page)
            setPageSize(data.pageSize)
            setTotalListings(data.total)
            setIsLoading(false);
        }).catch(e => {
            console.log("ERROR")
            console.log(e)
            setError("Something went wrong please try again later")
            setIsLoading(false);
        })
    }, [propertyTypesSearchQuery, router])
    return (
        <div className={""}>
            {isLoading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!error && !isLoading &&
                <div className={"text-xl mb-12"}>
                    <span className={"font-bold"}>Results: </span> <span>{totalListings} houses found.</span>
                </div>}
            <div className={"grid grid-cols-2 gap-16"}>
                {listings && listings.map((item, index) => (
                    <ListingItem listingItem={item} key={index}/>
                ))}
            </div>
        </div>
    );
}
