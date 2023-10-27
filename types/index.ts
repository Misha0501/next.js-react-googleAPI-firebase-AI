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
  applicationUser: ApplicationUser;
  areaGarage: number;
  areaGarden: number;
  balcony: boolean;
  areaLand: number;
  areaLiving: number;
  areaOutside: number;
  areaTotal: number;
  bathrooms: number;
  bedrooms: number;
  companyId: number;
  company: Company;
  constructedYear: string;
  createdAt: string;
  deleted: boolean;
  description: string;
  floorNumber: number;
  heatingType: HeatingType;
  houseNumber: string;
  averagePriceInNeighborhood?: number;
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
  price: number;
  buildingType?: BuildingType;
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
};

export type Address = {
  createdAt: string;
  id: number;
  route: string;
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
  createdAt?: string;
  updatedAt?: string;
};

export type ApplicationUser = {
  Listing: Listing[];
  SavedListing: SavedListing[];
  Membership: Membership[];
  SavedSearch: any[];
  createdAt: string;
  displayName: string;
  email: string;
  phoneNumber: string;
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
  email: string;
  Address?: Address[];
  memberships?: Membership[];
  Listing?: Listing[];
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
