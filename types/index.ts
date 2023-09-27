export type HeatingType = "CENTRAL" | "BOILER";
export type InteriorType = "FURNISHED" | "UNFURNISHED";
export type UpkeepType = "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
export type ListingType = "RENT" | "SELL";
export type CurrencyType = "EUR" | "USD" | "BGN";
export type PropertyType = "HOUSE" | "APARTMENT" | "PARKING" | "LAND";
export type CompanyMembershipRoleType = "ADMIN" | "EDITOR";
export type BuildingType = "New building" | "Old building";
export type Characteristics =
  | "Balcony"
  | "Garden"
  | "Renewable energy"
  | "Lying / sitting bath"
  | "Swimming pool";

export type FirebaseAPISignInAuthResponse = {
  kind: string;
  localId: string;
  email: string;
  idToken: string;
  displayName: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
};

export type ListingImage = {
  id?: number;
  listingId?: number;
  positionInListing?: number;
  url: string;
  imagePath?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Listing = {
  active: boolean;
  activeUntil: string;
  applicationUserId: number;
  areaGarage: number;
  areaLand: number;
  areaLiving: number;
  areaOutside: number;
  areaTotal: number;
  bathrooms: number;
  bedrooms: number;
  companyId: number;
  constructedYear: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  floorNumber: number;
  heatingType: HeatingType;
  houseNumber: string;
  ListingPrice: ListingPrice[];
  id: number;
  interiorType: InteriorType;
  latitude: string;
  listingType: ListingType;
  localityId: number;
  Address: Address[];
  ListingImage: ListingImage[];
  propertyType: PropertyType;
  longitude: string;
  numberOfFloorsCommon: number;
  numberOfFloorsProperty: number;
  parking: number;
  postalCode: string;
  propertyTypeId: number;
  rooms: number;
  streetName: string;
  updatedAt: string;
  upkeepType: UpkeepType;
  volume: number;
  savedListingId?: number;
  price?: number;
  currency?: CurrencyType;
};

export type ListingPrice = {
  id: number;
  listingId: number;
  listing?: Listing;
  price: number;
  currency: CurrencyType;
  createdAt: string;
  updatedAt: string;
}

export type Address = {
  createdAt: string;
  id: number;
  latitude: string;
  locality: string;
  longitude: string;
  neighborhood: string;
  postalCode: string;
  showExactLocation: boolean;
  streetName: string;
  updatedAt: string;
  listingId: number;
  companyId: number | null;
};

export type SavedListing = {
  applicationUserId: number;
  createdAt: string;
  id: number;
  listing: Listing;
  listingId: number;
  updatedAt: string;
};

export type SavedSearch = {
  id?: number;
  areaTotalMin?: string | number | null;
  areaTotalMax?: string | number | null;
  areaLivingMin?: string | number | null;
  areaLivingMax?: string | number | null;
  areaLandMin?: string | number | null;
  areaLandMax?: string | number | null;
  roomsMin?: string | number | null;
  roomsMax?: string | number | null;
  bedroomsMin?: string | number | null;
  bedroomsMax?: string | number | null;
  listedSince?: string | number | null;
  constructedYearMin?: string | number | null;
  constructedYearMax?: string | number | null;
  priceMin?: string | number | null;
  priceMax?: string | number | null;
  propertyType?: PropertyType[] | null;
  listingType?: ListingType | null;
  upkeepType?: UpkeepType[] | null;
  interiorType?: InteriorType[] | null;
  heatingType?: HeatingType[] | null;
  bathroomsMin?: string | number | null;
  bathroomsMax?: string | number | null;
  areaOutsideMin?: string | number | null;
  areaOutsideMax?: string | number | null;
  applicationUserId?: number;
  applicationUser?: ApplicationUser;
  locality?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApplicationUser = {
  Listing: Listing[];
  SavedListing: SavedListing[];
  SavedSearch: any[];
  createdAt: string;
  displayName: string;
  email: string;
  firebaseUID: string;
  id: number;
  providerId: string;
  updatedAt: string;
};

export type MatchedListingsAndSearches = {
  listing: Listing;
  matchedSearches: SavedSearch[];
};

export type AutocompleteAddress = {
  streetNumber: string;
  route: string;
  locality: string;
  administrativeAreaLevelOne: string;
  postalCode: string;
  neighborhood: string;
  latitude: string;
  longitude: string;
};

export type RecentlyViewedListing = {
  id: number;
  applicationUserId: number;
  listingId: number;
  listing: Listing;
};

export type Company = {
  id: number;
  name: string;
  phoneNumber: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  Address?: Address[];
  memberships?: Membership[];
  Listings?: Listing[];
};

export type Membership = {
  company: Company;
  applicationUserId: number;
  applicationUser?: ApplicationUser;
  applicationUserRole: string;
  companyId: number;
  createdAt: string;
  id: number;
  isActive: boolean;
  updatedAt: string;
};

export type CompanyMembershipInvite = {
  accepted: boolean;
  applicationUserEmailReceiver: string;
  applicationUserIdSender: number;
  applicationUserReceiver: ApplicationUser;
  applicationUserSender: ApplicationUser;
  applicationUserRole: CompanyMembershipRoleType;
  company: Company;
  companyId: number;
  createdAt: string;
  declined: string;
  expiresAt: string;
  id: number;
};
