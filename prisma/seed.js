const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const IMAGE_POOL = [
  "/property1.png",
  "/property2.png",
  "/property3.png",
  "/property4.jpg",
  "/property5.jpg",
  "/property6.jpg",
];
// Varied image counts per listing (cycles): mix of 1, 2, 3, 4
const IMAGE_COUNTS = [3, 1, 4, 2, 3, 4, 1, 3, 2, 4, 3, 1, 2, 3, 4, 2, 1, 3, 4, 3];

const USERS_DATA = [
  { displayName: "Ivan Petrov",       email: "ivan.petrov@homfli.com",       phoneNumber: "+359 88 123 4567" },
  { displayName: "Maria Georgieva",   email: "maria.georgieva@homfli.com",   phoneNumber: "+359 87 234 5678" },
  { displayName: "Nikolay Dimitrov",  email: "nikolay.dimitrov@homfli.com",  phoneNumber: "+359 89 345 6789" },
  { displayName: "Elena Stoyanova",   email: "elena.stoyanova@homfli.com",   phoneNumber: "+359 88 456 7890" },
  { displayName: "Georgi Ivanov",     email: "georgi.ivanov@homfli.com",     phoneNumber: "+359 87 567 8901" },
  { displayName: "Viktoria Koleva",   email: "viktoria.koleva@homfli.com",   phoneNumber: "+359 89 678 9012" },
  { displayName: "Stefan Todorov",    email: "stefan.todorov@homfli.com",    phoneNumber: "+359 88 789 0123" },
  { displayName: "Desislava Marinova",email: "desislava.marinova@homfli.com",phoneNumber: "+359 87 890 1234" },
  { displayName: "Aleksandar Hristov",email: "aleksandar.hristov@homfli.com",phoneNumber: "+359 89 901 2345" },
  { displayName: "Kalina Vasileva",   email: "kalina.vasileva@homfli.com",   phoneNumber: "+359 88 012 3456" },
];

// Apartment templates
const APT = {
  studio:    { areaTotal: 42,  areaLiving: 36,  areaOutside: null, rooms: 1, bedrooms: 1, bathrooms: 1, floorNumber: 3, numberOfFloorsCommon: 7,  builtYear: 2019, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
  a1br:      { areaTotal: 58,  areaLiving: 50,  areaOutside: null, rooms: 2, bedrooms: 1, bathrooms: 1, floorNumber: 4, numberOfFloorsCommon: 8,  builtYear: 2016, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
  a2br_s:    { areaTotal: 78,  areaLiving: 66,  areaOutside: 6,    rooms: 3, bedrooms: 2, bathrooms: 1, floorNumber: 2, numberOfFloorsCommon: 9,  builtYear: 2012, interiorType: "FURNISHED",   upkeepType: "GOOD",      heatingType: "CENTRAL" },
  a2br:      { areaTotal: 92,  areaLiving: 79,  areaOutside: 8,    rooms: 3, bedrooms: 2, bathrooms: 1, floorNumber: 5, numberOfFloorsCommon: 8,  builtYear: 2015, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
  a2br_l:    { areaTotal: 108, areaLiving: 93,  areaOutside: 10,   rooms: 3, bedrooms: 2, bathrooms: 2, floorNumber: 3, numberOfFloorsCommon: 6,  builtYear: 2018, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
  a3br:      { areaTotal: 128, areaLiving: 112, areaOutside: 12,   rooms: 4, bedrooms: 3, bathrooms: 2, floorNumber: 7, numberOfFloorsCommon: 10, builtYear: 2017, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
  a3br_ph:   { areaTotal: 162, areaLiving: 138, areaOutside: 22,   rooms: 4, bedrooms: 3, bathrooms: 2, floorNumber: 9, numberOfFloorsCommon: 9,  builtYear: 2020, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
  a4br:      { areaTotal: 184, areaLiving: 158, areaOutside: 18,   rooms: 5, bedrooms: 4, bathrooms: 3, floorNumber: 6, numberOfFloorsCommon: 9,  builtYear: 2021, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
  a_unfurn:  { areaTotal: 94,  areaLiving: 80,  areaOutside: 9,    rooms: 3, bedrooms: 2, bathrooms: 1, floorNumber: 4, numberOfFloorsCommon: 7,  builtYear: 2010, interiorType: "UNFURNISHED", upkeepType: "GOOD",      heatingType: "CENTRAL" },
  a_old:     { areaTotal: 72,  areaLiving: 62,  areaOutside: null, rooms: 3, bedrooms: 2, bathrooms: 1, floorNumber: 2, numberOfFloorsCommon: 6,  builtYear: 1997, interiorType: "FURNISHED",   upkeepType: "FAIR",      heatingType: "BOILER"  },
};

// House templates
const HSE = {
  h_s:    { areaTotal: 148, areaLiving: 122, areaLand: 340, areaOutside: 22, areaGarage: 18, rooms: 4, bedrooms: 3, bathrooms: 2, numberOfFloorsProperty: 2, numberOfFloorsCommon: 2, builtYear: 2010, interiorType: "FURNISHED",   upkeepType: "GOOD",      heatingType: "BOILER"  },
  h_m:    { areaTotal: 198, areaLiving: 165, areaLand: 500, areaOutside: 34, areaGarage: 22, rooms: 5, bedrooms: 4, bathrooms: 2, numberOfFloorsProperty: 2, numberOfFloorsCommon: 2, builtYear: 2013, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "BOILER"  },
  h_l:    { areaTotal: 262, areaLiving: 220, areaLand: 700, areaOutside: 44, areaGarage: 30, rooms: 6, bedrooms: 5, bathrooms: 3, numberOfFloorsProperty: 2, numberOfFloorsCommon: 2, builtYear: 2008, interiorType: "FURNISHED",   upkeepType: "GOOD",      heatingType: "BOILER"  },
  h_new:  { areaTotal: 224, areaLiving: 186, areaLand: 540, areaOutside: 38, areaGarage: 26, rooms: 5, bedrooms: 4, bathrooms: 3, numberOfFloorsProperty: 2, numberOfFloorsCommon: 2, builtYear: 2021, interiorType: "FURNISHED",   upkeepType: "EXCELLENT", heatingType: "CENTRAL" },
};

const ALL_TPLS = { ...APT, ...HSE };

// 15 zones × ~6-7 listings = 100 total
// Each neighborhood has 3+ listings of same (propertyType, listingType) for averagePriceInNeighborhood
const ZONES = [
  // ── Sofia ──────────────────────────────────────────────────────────────────
  {
    locality: "Sofia", neighborhood: "Lozenets",
    route: "ul. Krichim", postalCode: "1164",
    lat: 42.6743, lng: 23.3237,
    sellSqm: 3100, rentSqm: 15, landSqm: 520,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_l",  parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br_ph", parking: 1 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_m",     parking: 2 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_l",     parking: 2 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
    ],
  },
  {
    locality: "Sofia", neighborhood: "Mladost 4",
    route: "bul. Aleksandar Malinov", postalCode: "1715",
    lat: 42.6258, lng: 23.3796,
    sellSqm: 2250, rentSqm: 11, landSqm: 360,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_unfurn",parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
    ],
  },
  {
    locality: "Sofia", neighborhood: "Vitosha",
    route: "ul. Simeonsko shose", postalCode: "1700",
    lat: 42.6412, lng: 23.2987,
    sellSqm: 2800, rentSqm: 13, landSqm: 480,
    listings: [
      { lt: "SELL", pt: "HOUSE",     tpl: "h_new",   parking: 2 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_m",     parking: 2 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_s",     parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_l",  parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 1 },
    ],
  },
  {
    locality: "Sofia", neighborhood: "Center",
    route: "bul. Vitosha", postalCode: "1000",
    lat: 42.6977, lng: 23.3219,
    sellSqm: 3500, rentSqm: 18, landSqm: 600,
    listings: [
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "studio",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_l",  parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br_ph", parking: 1 },
    ],
  },
  // ── Plovdiv ────────────────────────────────────────────────────────────────
  {
    locality: "Plovdiv", neighborhood: "Kapana",
    route: "ul. Zlatarska", postalCode: "4000",
    lat: 42.1497, lng: 24.7481,
    sellSqm: 1850, rentSqm: 9, landSqm: 250,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_old",   parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "studio",  parking: 0 },
    ],
  },
  {
    locality: "Plovdiv", neighborhood: "Karshiyaka",
    route: "bul. Bulgaria", postalCode: "4003",
    lat: 42.1639, lng: 24.7411,
    sellSqm: 1500, rentSqm: 8, landSqm: 210,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_unfurn",parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_s",     parking: 1 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_m",     parking: 2 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_new",   parking: 2 },
    ],
  },
  // ── Varna ──────────────────────────────────────────────────────────────────
  {
    locality: "Varna", neighborhood: "Chayka",
    route: "bul. Knyaz Boris I", postalCode: "9010",
    lat: 43.2149, lng: 27.9438,
    sellSqm: 2200, rentSqm: 11, landSqm: 320,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_l",  parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
    ],
  },
  {
    locality: "Varna", neighborhood: "Sea Garden",
    route: "ul. Preslav", postalCode: "9000",
    lat: 43.2028, lng: 27.9189,
    sellSqm: 2700, rentSqm: 14, landSqm: 380,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br_ph", parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_l",  parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 1 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_new",   parking: 2 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_m",     parking: 2 },
    ],
  },
  // ── Burgas ─────────────────────────────────────────────────────────────────
  {
    locality: "Burgas", neighborhood: "Lazur",
    route: "ul. Koprivshtitsa", postalCode: "8001",
    lat: 42.5073, lng: 27.4756,
    sellSqm: 1750, rentSqm: 9, landSqm: 220,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a3br",    parking: 1 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_l",  parking: 1 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "studio",  parking: 0 },
    ],
  },
  {
    locality: "Burgas", neighborhood: "Center",
    route: "ul. Aleksandrovska", postalCode: "8000",
    lat: 42.4940, lng: 27.4726,
    sellSqm: 1600, rentSqm: 8, landSqm: 200,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_old",   parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_unfurn",parking: 0 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_s",     parking: 1 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_m",     parking: 2 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_l",     parking: 2 },
    ],
  },
  // ── Ruse ───────────────────────────────────────────────────────────────────
  {
    locality: "Ruse", neighborhood: "Center",
    route: "ul. Aleksandrovska", postalCode: "7000",
    lat: 43.8564, lng: 25.9739,
    sellSqm: 1200, rentSqm: 6, landSqm: 180,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_old",   parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_unfurn",parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "studio",  parking: 0 },
    ],
  },
  {
    locality: "Ruse", neighborhood: "Druzhba",
    route: "bul. Treti Mart", postalCode: "7012",
    lat: 43.8450, lng: 25.9580,
    sellSqm: 1050, rentSqm: 5, landSqm: 150,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_old",   parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
    ],
  },
  // ── Pleven ─────────────────────────────────────────────────────────────────
  {
    locality: "Pleven", neighborhood: "Center",
    route: "ul. Vasil Levski", postalCode: "5800",
    lat: 43.4172, lng: 24.6064,
    sellSqm: 1100, rentSqm: 5.5, landSqm: 160,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_old",   parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_unfurn",parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "studio",  parking: 0 },
    ],
  },
  {
    locality: "Pleven", neighborhood: "Storgozia",
    route: "ul. Georgi Kochev", postalCode: "5805",
    lat: 43.4050, lng: 24.5980,
    sellSqm: 950, rentSqm: 5, landSqm: 140,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_old",   parking: 0 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_s",     parking: 1 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_m",     parking: 2 },
    ],
  },
  // ── Sliven ─────────────────────────────────────────────────────────────────
  {
    locality: "Sliven", neighborhood: "Center",
    route: "ul. Tsar Simeon", postalCode: "8800",
    lat: 42.6861, lng: 26.3228,
    sellSqm: 1050, rentSqm: 5, landSqm: 140,
    listings: [
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_old",   parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a_unfurn",parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a1br",    parking: 0 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br_s",  parking: 0 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_s",     parking: 1 },
      { lt: "SELL", pt: "HOUSE",     tpl: "h_m",     parking: 2 },
      { lt: "RENT", pt: "APARTMENT", tpl: "a2br",    parking: 0 },
      { lt: "SELL", pt: "APARTMENT", tpl: "a4br",    parking: 1 },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function euros(v) {
  return Math.round(v / 100) * 100;
}

function calcPrice(zone, spec, tpl) {
  if (spec.lt === "SELL" && spec.pt === "APARTMENT") {
    return euros(tpl.areaTotal * zone.sellSqm);
  }
  if (spec.lt === "SELL" && spec.pt === "HOUSE") {
    return euros(tpl.areaLiving * zone.sellSqm * 0.92 + (tpl.areaLand || 0) * zone.landSqm * 0.35);
  }
  if (spec.lt === "RENT") {
    const mult = spec.pt === "HOUSE" ? 1.25 : 1.0;
    return euros((tpl.areaLiving || tpl.areaTotal) * zone.rentSqm * mult);
  }
  return euros(tpl.areaTotal * zone.sellSqm);
}

function buildDescription(zone, spec, tpl, price) {
  const propLabel = { APARTMENT: "apartment", HOUSE: "house" }[spec.pt] || spec.pt.toLowerCase();
  const action = spec.lt === "RENT" ? "rent" : "sale";
  const priceStr = price.toLocaleString("bg-BG", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const furnishing = tpl.interiorType === "FURNISHED" ? "fully furnished and ready to move in" : "unfurnished — ideal if you want to choose your own interior";
  const condition = { EXCELLENT: "excellent condition with modern finishes", GOOD: "good condition throughout", FAIR: "fair condition with some cosmetic work needed" }[tpl.upkeepType] || "good condition";
  const floor = tpl.floorNumber ? `floor ${tpl.floorNumber} of a ${tpl.numberOfFloorsCommon}-storey building` : `a ${tpl.numberOfFloorsCommon}-storey property`;
  const extra = tpl.areaOutside ? ` with a ${tpl.areaOutside} sqm balcony` : "";
  return `Bright ${tpl.areaTotal} sqm ${propLabel} for ${action} in ${zone.neighborhood}, ${zone.locality}${extra}. The property offers ${tpl.rooms} rooms, ${tpl.bedrooms} bedroom${tpl.bedrooms !== 1 ? "s" : ""}, and ${tpl.bathrooms} bathroom${tpl.bathrooms !== 1 ? "s" : ""}, situated on ${floor}. It is ${furnishing} and in ${condition}. Walking distance to public transport, shops, and local services. Asking price: ${priceStr}.`;
}

function buildKeyPoints(zone, spec, tpl) {
  const kp = [];
  if (tpl.areaOutside) kp.push(["Outdoor space", `${tpl.areaOutside} sqm terrace or balcony with natural light.`]);
  if (spec.parking > 0) kp.push(["Parking included", `${spec.parking} dedicated parking space${spec.parking > 1 ? "s" : ""} with the property.`]);
  kp.push(["Prime location", `Situated in ${zone.neighborhood}, close to transport and everyday services in ${zone.locality}.`]);
  if (tpl.heatingType === "CENTRAL") kp.push(["Central heating", "Building heating with individual metering — comfortable and cost-efficient."]);
  else kp.push(["Independent heating", "Gas boiler giving you full control over heating costs."]);
  if (tpl.builtYear >= 2015) kp.push(["Modern build", `Constructed in ${tpl.builtYear} with contemporary standards and quality materials.`]);
  if (tpl.areaLand) kp.push(["Private garden", `${tpl.areaLand} sqm of private land — great for outdoor living or a vegetable garden.`]);
  return kp.slice(0, 3);
}

function buildImages(listingIdx) {
  const count = IMAGE_COUNTS[listingIdx % IMAGE_COUNTS.length];
  const imgs = [];
  for (let i = 0; i < count; i++) {
    const url = IMAGE_POOL[(listingIdx * 3 + i) % IMAGE_POOL.length];
    imgs.push({ url, imagePath: url, positionInListing: i });
  }
  return imgs;
}

function buildPriceHistory(currentPrice, listingIdx, createdAt) {
  const scenario = listingIdx % 3;

  if (scenario === 0) {
    // 3 price entries: listed high → first reduction → current
    const p0 = euros(currentPrice * 1.14);
    const p1 = euros(currentPrice * 1.07);
    const t0 = new Date(createdAt.getTime() - 70 * MS_PER_DAY);
    const t1 = new Date(createdAt.getTime() - 35 * MS_PER_DAY);
    return [
      { currency: "EUR", price: p0, tax: null, createdAt: t0 },
      { currency: "EUR", price: p1, tax: null, createdAt: t1 },
      { currency: "EUR", price: currentPrice, tax: null, createdAt },
    ];
  }

  if (scenario === 1) {
    // 4 price entries: listed → bump up → two reductions → current
    const p0 = euros(currentPrice * 1.10);
    const p1 = euros(currentPrice * 1.16);
    const p2 = euros(currentPrice * 1.05);
    const t0 = new Date(createdAt.getTime() - 100 * MS_PER_DAY);
    const t1 = new Date(createdAt.getTime() - 70 * MS_PER_DAY);
    const t2 = new Date(createdAt.getTime() - 35 * MS_PER_DAY);
    return [
      { currency: "EUR", price: p0, tax: null, createdAt: t0 },
      { currency: "EUR", price: p1, tax: null, createdAt: t1 },
      { currency: "EUR", price: p2, tax: null, createdAt: t2 },
      { currency: "EUR", price: currentPrice, tax: null, createdAt },
    ];
  }

  // scenario === 2: 3 entries with steady reductions
  const p0 = euros(currentPrice * 1.18);
  const p1 = euros(currentPrice * 1.09);
  const t0 = new Date(createdAt.getTime() - 80 * MS_PER_DAY);
  const t1 = new Date(createdAt.getTime() - 40 * MS_PER_DAY);
  return [
    { currency: "EUR", price: p0, tax: null, createdAt: t0 },
    { currency: "EUR", price: p1, tax: null, createdAt: t1 },
    { currency: "EUR", price: currentPrice, tax: null, createdAt },
  ];
}

function coord(base, i, scale) {
  return (base + (i + 1) * scale).toFixed(6);
}

// ── Delete all data ───────────────────────────────────────────────────────────

async function deleteAllData() {
  console.log("Deleting all existing data...");
  await prisma.sentNotificationSavedSearch.deleteMany({});
  await prisma.recentlyViewedListing.deleteMany({});
  await prisma.savedListing.deleteMany({});
  await prisma.listingDescriptionKeyPoint.deleteMany({});
  await prisma.listingImage.deleteMany({});
  // Null out self-reference before deleting
  await prisma.listingPrice.updateMany({ data: { updatedListingPriceId: null } });
  await prisma.listingPrice.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.savedSearch.deleteMany({});
  await prisma.companyMembershipInvite.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.applicationUser.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.subscriptionPlan.deleteMany({});
  console.log("Done.");
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function main() {
  await deleteAllData();

  // Create users
  const users = [];
  for (const u of USERS_DATA) {
    const slug = u.email.split("@")[0];
    const user = await prisma.applicationUser.create({
      data: {
        firebaseUID: `seed-${slug}`,
        email: u.email,
        displayName: u.displayName,
        providerId: "seed",
        phoneNumber: u.phoneNumber,
      },
    });
    users.push(user);
  }
  console.log(`Created ${users.length} users.`);

  // Create listings
  let listingIdx = 0;
  const now = Date.now();

  for (const zone of ZONES) {
    for (const spec of zone.listings) {
      const tpl = ALL_TPLS[spec.tpl];
      if (!tpl) throw new Error(`Unknown template: ${spec.tpl}`);

      const user = users[listingIdx % users.length];
      const price = calcPrice(zone, spec, tpl);
      const daysAgo = (listingIdx * 4) % 90;
      const createdAt = new Date(now - daysAgo * MS_PER_DAY);
      const activeUntil = new Date(now + (45 + (listingIdx * 7) % 75) * MS_PER_DAY);
      const streetNumber = String(5 + (listingIdx * 3) % 120);
      const latStr = coord(zone.lat, listingIdx % 8, 0.0009);
      const lngStr = coord(zone.lng, listingIdx % 8, 0.0009);

      await prisma.listing.create({
        data: {
          applicationUserId: user.id,
          listingType: spec.lt,
          propertyType: spec.pt,
          interiorType: tpl.interiorType || null,
          upkeepType: tpl.upkeepType || null,
          heatingType: tpl.heatingType || null,
          description: buildDescription(zone, spec, tpl, price),
          price,
          currency: "EUR",
          locality: zone.locality,
          areaTotal: tpl.areaTotal || null,
          areaLiving: tpl.areaLiving || null,
          areaLand: tpl.areaLand || null,
          areaOutside: tpl.areaOutside || null,
          areaGarage: tpl.areaGarage || null,
          streetName: zone.route,
          houseNumber: streetNumber,
          postalCode: zone.postalCode,
          latitude: latStr,
          longitude: lngStr,
          rooms: tpl.rooms || null,
          bedrooms: tpl.bedrooms || null,
          bathrooms: tpl.bathrooms || null,
          parking: spec.parking > 0 ? spec.parking : null,
          constructedYear: tpl.builtYear ? new Date(`${tpl.builtYear}-06-01T00:00:00.000Z`) : null,
          floorNumber: tpl.floorNumber || null,
          numberOfFloorsProperty: tpl.numberOfFloorsProperty || null,
          numberOfFloorsCommon: tpl.numberOfFloorsCommon || null,
          active: true,
          activeUntil,
          createdAt,
          Address: {
            create: [{
              streetNumber,
              route: zone.route,
              administrativeAreaLevelOne: "Bulgaria",
              locality: zone.locality,
              postalCode: zone.postalCode,
              neighborhood: zone.neighborhood,
              latitude: latStr,
              longitude: lngStr,
              showExactLocation: true,
            }],
          },
          ListingImage: {
            create: buildImages(listingIdx),
          },
          ListingPrice: {
            create: buildPriceHistory(price, listingIdx, createdAt),
          },
          listingDescriptionKeyPoints: {
            create: buildKeyPoints(zone, spec, tpl).map(([title, description]) => ({ title, description })),
          },
        },
      });

      listingIdx++;
    }
  }

  console.log(`Created ${listingIdx} listings across ${ZONES.length} neighbourhoods for ${users.length} users.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
