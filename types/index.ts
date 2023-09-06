export type HeatingType = "CENTRAL" | "BOILER";
export type InteriorType = "FURNISHED" | "UNFURNISHED";
export type UpkeepType = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
export type ListingType = 'RENT' | 'SELL';

export type FirebaseAPISignInAuthResponse = {
    kind: string
    localId: string
    email: string
    idToken: string
    displayName: string
    registered: boolean
    refreshToken: string
    expiresIn: string
}

export type ListingItem = {
    active: boolean
    activeUntil: string
    applicationUserId: number
    areaGarage: number
    areaLand: number
    areaLiving: number
    areaOutside: number
    areaTotal: number
    bathrooms: number
    bedrooms: number
    companyId: number
    constructedYear: string
    createdAt: string
    deleted: boolean
    description: string
    floorNumber: number
    heatingType: HeatingType
    houseNumber: string
    id: number
    interiorType: InteriorType
    latitude: string
    listingType: ListingType
    localityId: number
    longitude: string
    numberOfFloorsCommon: number
    numberOfFloorsProperty: number
    parking: number
    postalCode: string
    propertyTypeId: number
    rooms: number
    streetName: string
    updatedAt: string
    upkeepType: UpkeepType
    volume: number
    savedListingId?: number;
}

export type SavedListing = {
    applicationUserId: number
    createdAt: string
    id: number
    listing: ListingItem
    listingId: number
    updatedAt: string
}
