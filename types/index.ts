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
  positionInListing?: number | null;
  url: string;
  imagePath?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Listing = {
  active: boolean;
  activeUntil: Date | string;
  applicationUserId: number;
  applicationUser?: ApplicationUser;
  areaGarage?: number | null;
  areaGarden?: number | null;
  balcony?: boolean;
  areaLand?: number | null;
  areaLiving?: number | null;
  areaOutside?: number | null;
  areaTotal?: number | null;
  bathrooms?: number | null;
  bedrooms?: number | null;
  companyId?: number | null;
  company?: Company | null;
  constructedYear?: string | null;
  createdAt: Date | string;
  deleted: Date | null;
  description?: string | null;
  floorNumber?: number | null;
  heatingType?: HeatingType | null;
  houseNumber?: string | null;
  averagePriceInNeighborhood?: number;
  ListingPrice: ListingPrice[];
  id: number;
  interiorType?: InteriorType | null;
  latitude?: string | null;
  listingType?: ListingType | null;
  localityId?: number;
  Address: Address[];
  ListingImage: ListingImage[];
  propertyType?: PropertyType | null;
  longitude?: string | null;
  numberOfFloorsCommon?: number | null;
  numberOfFloorsProperty?: number | null;
  parking?: number | null;
  postalCode?: string | null;
  propertyTypeId?: number;
  rooms?: number | null;
  streetName?: string | null;
  updatedAt: Date | string;
  upkeepType?: UpkeepType | null;
  volume?: number | null;
  savedListingId?: number;
  price: number;
  buildingType?: BuildingType;
  currency?: CurrencyType | null;
};

export type ListingPrice = {
  id: number;
  listingId: number;
  listing?: Listing;
  price: number;
  currency: CurrencyType;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Address = {
  createdAt: Date | string;
  id: number;
  route: string | null;
  latitude: string;
  locality: string | null;
  longitude: string;
  neighborhood: string | null;
  postalCode: string | null;
  showExactLocation: boolean;
  administrativeAreaLevelOne: string | null;
  streetNumber: string | null;
  streetName?: string | null;
  updatedAt: Date | string;
  listingId: number;
  companyId: number | null;
};

export type SavedListing = {
  applicationUserId: number;
  createdAt: Date | string;
  id: number;
  listing: Listing;
  listingId: number;
  updatedAt: Date | string;
};

export type SavedSearch = {
  id?: number;
  areaTotalMin?: number | null;
  areaTotalMax?: number | null;
  areaLivingMin?: number | null;
  areaLivingMax?: number | null;
  areaLandMin?: number | null;
  areaLandMax?: number | null;
  roomsMin?: number | null;
  roomsMax?: number | null;
  bedroomsMin?: number | null;
  bedroomsMax?: number | null;
  listedSince?: number | null;
  constructedYearMin?: string | number | null;
  constructedYearMax?: string | number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  propertyType?: PropertyType[] | null;
  listingType?: ListingType | null;
  upkeepType?: UpkeepType[] | null;
  interiorType?: InteriorType[] | null;
  heatingType?: HeatingType[] | null;
  bathroomsMin?: number | null;
  bathroomsMax?: number | null;
  areaOutsideMin?: number | null;
  areaOutsideMax?: number | null;
  applicationUserId?: number;
  applicationUser?: ApplicationUser;
  locality?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ApplicationUser = {
  Listing?: Listing[];
  SavedListing?: SavedListing[];
  Membership?: Membership[];
  SavedSearch?: SavedSearch[];
  createdAt: Date | string;
  displayName: string;
  email: string;
  phoneNumber?: string | null;
  firebaseUID: string;
  id: number;
  providerId: string;
  updatedAt: Date | string;
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
  phoneNumber: string | null;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  email: string | null;
  Address?: Address[];
  memberships?: Membership[];
  Listing?: Listing[];
};

export type Membership = {
  company?: Company;
  applicationUserId: number;
  applicationUser?: ApplicationUser;
  applicationUserRole: string;
  companyId: number;
  createdAt: Date | string;
  id: number;
  isActive: boolean;
  updatedAt: Date | string;
};

export type CompanyMembershipInvite = {
  accepted: Date | null;
  applicationUserEmailReceiver: string;
  applicationUserIdSender: number;
  applicationUserReceiver?: ApplicationUser;
  applicationUserSender?: ApplicationUser;
  applicationUserRole: string;
  company?: Company;
  companyId: number;
  createdAt: Date | string;
  declined: Date | null;
  expiresAt: Date | null;
  id: number;
};
