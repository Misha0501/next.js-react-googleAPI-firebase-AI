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

  return `Write a short property listing description in English based on the details below. Write it the way a real person would — plain language, no marketing clichés, no excessive adjectives. Just describe what the property is and what makes it practical or interesting.

Property details:
${lines.join("\n")}

Rules:
- 100–180 words
- Use simple, direct sentences. Avoid words like "stunning", "boasting", "nestled", "perfect", "amazing", "featuring", "charming", "ideal"
- Mention the key facts: size, layout, location, condition, and anything notable
- Skip details that are missing or zero
- No opening like "Welcome to..." or closing like "Don't miss this opportunity"
- Output the description text only — no title, no bullet points, no headers`;
}
