type DescriptionPayload = Record<string, unknown>;

const LISTING_TYPE_LABELS: Record<string, string> = {
  SELL: "for sale",
  RENT: "for rent",
};

const UPKEEP_LABELS: Record<string, string> = {
  EXCELLENT: "excellent condition",
  GOOD: "good condition",
  FAIR: "fair condition",
  POOR: "needs renovation",
};

const INTERIOR_LABELS: Record<string, string> = {
  FURNISHED: "furnished",
  UNFURNISHED: "unfurnished",
};

const HEATING_LABELS: Record<string, string> = {
  BOILER: "individual boiler heating",
  CENTRAL: "central heating",
};

export function buildGeminiPrompt(data: DescriptionPayload): string {
  const lines: string[] = [];

  const add = (label: string, value: unknown, suffix = "") => {
    if (value !== null && value !== undefined && value !== "" && value !== 0) {
      lines.push(`- ${label}: ${value}${suffix}`);
    }
  };

  add("Listing", LISTING_TYPE_LABELS[String(data.listingType)] ?? data.listingType);
  add("Property type", String(data.propertyType ?? "").toLowerCase());
  add("Price", data.price, ` ${data.currency ?? ""}`);
  add("City", data.locality);
  add("Neighborhood", data.neighborhood);
  add("Rooms", data.rooms);
  add("Bedrooms", data.bedrooms);
  add("Bathrooms", data.bathrooms);
  add("Parking spaces", data.parking);
  add("Total area", data.areaTotal, " m²");
  add("Living area", data.areaLiving, " m²");
  add("Garden / outside area", data.areaOutside, " m²");
  add("Garage area", data.areaGarage, " m²");

  if (data.interiorType) add("Interior", INTERIOR_LABELS[String(data.interiorType)] ?? data.interiorType);
  if (data.upkeepType) add("Condition", UPKEEP_LABELS[String(data.upkeepType)] ?? data.upkeepType);
  if (data.heatingType) add("Heating", HEATING_LABELS[String(data.heatingType)] ?? data.heatingType);

  if (data.constructedYear) add("Year built", data.constructedYear);

  const floor = data.floorNumber;
  const totalFloors = data.numberOfFloorsCommon;
  if (floor && totalFloors) add("Floor", `${floor} of ${totalFloors}`);
  else if (floor) add("Floor", floor);

  return `You are a professional real estate copywriter for a Bulgarian property platform.

Write a compelling, natural-sounding property listing description in English based on the details below.

Property details:
${lines.join("\n")}

Requirements:
- 180–280 words
- Warm, professional tone — write as if you are the listing agent
- Open with the property's strongest feature or location advantage
- Flow naturally through space, condition, practicalities, and setting
- End with a subtle invitation to book a viewing
- Only use the details provided — do not invent anything
- Omit any detail that is missing or zero
- Output the description only — no title, no bullet points, no headers`;
}
