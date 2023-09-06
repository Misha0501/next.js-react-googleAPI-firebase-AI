'use client';
import {useEffect, useState} from "react";
import {useFiltersStore} from "@/store/Filters";
import {ListingItem} from "@/app/components/ListingItem";
import {useRouter} from "next/navigation";
import {getFetchUrl} from "@/app/lib/getFetchUrl";
import {useAuthContext} from "@/app/context/AuthContext";
import {SavedListing} from "@/types";

export const ListingsMain = ({label, checked, onChange, name}) => {
    const {authToken} = useAuthContext()
    const propertyTypesSearchQuery = useFiltersStore((state) => state.propertyTypesSearchQuery)
    const [listings, setListings] = useState<ListingItem[]>([]);
    const [isLoadingListings, setIsLoadingListings] = useState(true);
    const [isLoadingSavedListings, setIsLoadingSavedListings] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [totalListings, setTotalListings] = useState(0);
    const router = useRouter()

    const handleSavedIconClick = (listing: ListingItem) => {
        // if listings isn't saved we do a post request to save it
        if (!listing.savedListingId) {
            fetch(getFetchUrl(`api/savedListings`), {
                method: 'POST',
                cache: 'no-store',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify({listingId: listing.id}),
            }).then(response => response.json()).then((savedListing:SavedListing) => {
                // populate current listings with updated data
                const updatedListings = listings.map(item => {
                    if (item.id === listing.id) {
                        item.savedListingId = savedListing.id;
                    }
                    return item;
                });
                setListings([...updatedListings])

            }).catch(error => {
                console.error(error);
                console.error(error.message);
            });
        } else {
            // if it's saved we do a delete request
            if (!listing.savedListingId) return;

            fetch(getFetchUrl(`api/savedListings/${listing.savedListingId}`), {
                method: 'DELETE',
                cache: 'no-store',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': authToken,
                },
            }).then(() => {
                const updatedListings = listings.map(item => {
                    if (item.savedListingId === listing.savedListingId) {
                        item.savedListingId = null;
                    }
                    return item;
                });
                setListings([...updatedListings])

            }).catch(error => {console.error(error.message)})
        }
    };

    const updateListingsWithSavedFeature = async (listings: ListingItem[]) => {
        // get the data from the api
        const response = await fetch(getFetchUrl(`api/savedListings`), {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-type': 'application/json',
                'Authorization': authToken,
            }
        })
        // convert the data to json
        const data = await response.json();

        let savedListings: SavedListing[] = data.results;
        let savedListingsListingIds = []

        // Store all savedListing's listingIds
        if (savedListings) {
            savedListingsListingIds = data.results.map(el => el.listingId);
        }

        // populate listings with saved listings data
        const populatedListingsWithSavedListingData = listings.map(listing => {

            const savedListingListingId = savedListingsListingIds.find((savedListingId) => savedListingId === listing.id);
            const savedListing = savedListings.find((savedListing: SavedListing) => savedListing.listingId === savedListingListingId);

            if (savedListingListingId && savedListingListingId) {
                listing.savedListingId = savedListing.id;
            } else {
                listing.savedListingId = null;
            }
            return listing;
        })

        setListings([...populatedListingsWithSavedListingData])
    }


    useEffect(() => {
        const url = `api/listings?${propertyTypesSearchQuery.toString()}`;
        const fetchListings = async () => {
            const response = await fetch(url, {cache: "no-store"});
            return await response.json();
        }
        fetchListings().then(data => {

            // Set listings data
            setListings(data.results)
            setPage(data.page)
            setPageSize(data.pageSize)
            setTotalListings(data.total)
            setIsLoadingListings(false);

            // Fetch saved icons
            return updateListingsWithSavedFeature(data.results)
        })
            .then(() => setIsLoadingSavedListings(false))
            .catch(e => {
                console.error(e)
                setError("Something went wrong please try again later")
                setIsLoadingListings(false);
            })

    }, [propertyTypesSearchQuery, router])

    return (
        <div className={""}>
            {isLoadingListings && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!error && !isLoadingListings &&
                <div className={"text-xl mb-12"}>
                    <span className={"font-bold"}>Results: </span> <span>{totalListings} houses found.</span>
                </div>}
            <div className={"grid grid-cols-2 gap-16"}>
                {listings && listings.map((item: ListingItem, index: number) => (
                    <ListingItem listingItem={item} key={index} onSavedIconClick={handleSavedIconClick}
                                 isLoadingSavedListings={isLoadingSavedListings}/>
                ))}
            </div>
        </div>
    );
}
