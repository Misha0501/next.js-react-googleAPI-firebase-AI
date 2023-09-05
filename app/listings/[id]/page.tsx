import {notFound} from "next/navigation";
import {StarIcon} from "@heroicons/react/24/solid";
import {HeatingType, InteriorType, ListingItem, ListingType, UpkeepType} from "@/types";
import {getFetchUrl} from "@/app/lib/getFetchUrl";

export const revalidate = 300;

type Props = {
    params: {
        id: string;
    };
};

 async function ListingPage({params: {id}}: Props) {
    const response = await fetch(getFetchUrl(`api/listings/${id}`))
    const item = (await response.json()) as ListingItem;

    // if (!productData.content.pricing) {
    //     // redirect to 404 page
    //     notFound();
    // }

    return (
        <div className="p-12 pt-0">
            <p>Item data: {item.listingType}</p>
            <p>active: {item.active}</p>
            <p>activeUntil: {item.activeUntil}</p>
            <p>applicationUserId: {item.applicationUserId}</p>
            <p>areaGarage: {item.areaGarage}</p>
            <p>areaLand: {item.areaLand}</p>
            <p>areaLiving: {item.areaLiving}</p>
            <p>areaOutside: {item.areaOutside}</p>
            <p>areaTotal: {item.areaTotal}</p>
            <p>bathrooms: {item.bathrooms}</p>
            <p>bedrooms: {item.bedrooms}</p>
            <p>companyId: {item.companyId}</p>
            <p>constructedYear: {item.constructedYear}</p>
            <p>createdAt: {item.createdAt}</p>
            <p>deleted: {item.deleted}</p>
            <p>description: {item.description}</p>
            <p>floorNumber: {item.floorNumber}</p>
            <p>heatingType: {item.heatingType}</p>
            <p>houseNumber: {item.houseNumber}</p>
            <p>id: {item.id}</p>
            <p>interiorType: {item.interiorType}</p>
            <p>latitude: {item.latitude}</p>
            <p>listingType: {item.listingType}</p>
            <p>localityId: {item.localityId}</p>
            <p>longitude: {item.longitude}</p>
            <p>numberOfFloorsCommon: {item.numberOfFloorsCommon}</p>
            <p>numberOfFloorsProperty: {item.numberOfFloorsProperty}</p>
            <p>parking: {item.parking}</p>
            <p>postalCode: {item.postalCode}</p>
            <p>propertyTypeId: {item.propertyTypeId}</p>
            <p>rooms: {item.rooms}</p>
            <p>streetName: {item.streetName}</p>
            <p>updatedAt: {item.updatedAt}</p>
            <p>upkeepType: {item.upkeepType}</p>
            <p>volume: {item.volume}</p>
        </div>
    );
}

export default ListingPage;