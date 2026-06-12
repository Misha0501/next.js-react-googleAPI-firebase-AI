const {
  PrismaClient,
  Currency,
  HeatingType,
  InteriorType,
  ListingType,
  PropertyType,
  UpkeepType,
} = require("@prisma/client");

const prisma = new PrismaClient();

const SEED_EMAIL_DOMAIN = "seed.boratech.test";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const imagePool = [
  "/property1.png",
  "/property2.png",
  "/property3.png",
  "/property4.jpg",
  "/property5.jpg",
  "/property6.jpg",
  "/e1.png",
  "/e2.jpg",
  "/e3.jpg",
  "/e4.jpg",
];

const agencies = [
  {
    companyName: "Urban Nest Properties",
    userName: "Elena Petrova",
    city: "Sofia",
    route: "ul. Graf Ignatiev",
    streetNumber: "22",
    postalCode: "1000",
    latitude: "42.6928",
    longitude: "23.3209",
  },
  {
    companyName: "Black Sea Homes",
    userName: "Nikolay Dimitrov",
    city: "Varna",
    route: "bul. Knyaz Boris I",
    streetNumber: "41",
    postalCode: "9000",
    latitude: "43.2141",
    longitude: "27.9147",
  },
  {
    companyName: "Old Town Estates",
    userName: "Maria Ivanova",
    city: "Plovdiv",
    route: "ul. Hristo Dyukmedzhiev",
    streetNumber: "8",
    postalCode: "4000",
    latitude: "42.1506",
    longitude: "24.7463",
  },
  {
    companyName: "Mountain View Realty",
    userName: "Georgi Stoyanov",
    city: "Bansko",
    route: "ul. Pirin",
    streetNumber: "67",
    postalCode: "2770",
    latitude: "41.8354",
    longitude: "23.4857",
  },
  {
    companyName: "Coastline Living",
    userName: "Viktoria Koleva",
    city: "Burgas",
    route: "ul. Aleksandrovska",
    streetNumber: "19",
    postalCode: "8000",
    latitude: "42.4940",
    longitude: "27.4726",
  },
];

const locations = [
  {
    locality: "Sofia",
    neighborhood: "Lozenets",
    route: "ul. Krichim",
    postalCode: "1164",
    latitude: 42.6743,
    longitude: 23.3237,
    pricePerSqm: 3100,
    rentPerSqm: 15,
    landPerSqm: 520,
    parkingPrice: 26000,
  },
  {
    locality: "Sofia",
    neighborhood: "Mladost 4",
    route: "bul. Aleksandar Malinov",
    postalCode: "1715",
    latitude: 42.6258,
    longitude: 23.3796,
    pricePerSqm: 2250,
    rentPerSqm: 11,
    landPerSqm: 360,
    parkingPrice: 19000,
  },
  {
    locality: "Plovdiv",
    neighborhood: "Kapana",
    route: "ul. Zlatarska",
    postalCode: "4000",
    latitude: 42.1497,
    longitude: 24.7481,
    pricePerSqm: 1850,
    rentPerSqm: 9,
    landPerSqm: 250,
    parkingPrice: 15000,
  },
  {
    locality: "Plovdiv",
    neighborhood: "Karshiyaka",
    route: "bul. Bulgaria",
    postalCode: "4003",
    latitude: 42.1639,
    longitude: 24.7411,
    pricePerSqm: 1500,
    rentPerSqm: 8,
    landPerSqm: 210,
    parkingPrice: 12500,
  },
  {
    locality: "Varna",
    neighborhood: "Chayka",
    route: "bul. Knyaz Boris I",
    postalCode: "9010",
    latitude: 43.2149,
    longitude: 27.9438,
    pricePerSqm: 2200,
    rentPerSqm: 11,
    landPerSqm: 320,
    parkingPrice: 17500,
  },
  {
    locality: "Varna",
    neighborhood: "Greek Quarter",
    route: "ul. Preslav",
    postalCode: "9000",
    latitude: 43.2028,
    longitude: 27.9189,
    pricePerSqm: 2500,
    rentPerSqm: 13,
    landPerSqm: 350,
    parkingPrice: 21000,
  },
  {
    locality: "Byala",
    neighborhood: "Central Beach",
    route: "ul. Han Tervel",
    postalCode: "9101",
    latitude: 42.8744,
    longitude: 27.8881,
    pricePerSqm: 1150,
    rentPerSqm: 6,
    landPerSqm: 95,
    parkingPrice: 8000,
  },
  {
    locality: "Burgas",
    neighborhood: "Lazur",
    route: "ul. Koprivshtitsa",
    postalCode: "8001",
    latitude: 42.5073,
    longitude: 27.4756,
    pricePerSqm: 1750,
    rentPerSqm: 9,
    landPerSqm: 220,
    parkingPrice: 14000,
  },
  {
    locality: "Bansko",
    neighborhood: "Gondola Area",
    route: "ul. Nayden Gerov",
    postalCode: "2770",
    latitude: 41.8289,
    longitude: 23.4775,
    pricePerSqm: 1050,
    rentPerSqm: 7,
    landPerSqm: 120,
    parkingPrice: 9000,
  },
  {
    locality: "Veliko Tarnovo",
    neighborhood: "Varusha",
    route: "ul. Gurko",
    postalCode: "5000",
    latitude: 43.0829,
    longitude: 25.6382,
    pricePerSqm: 1250,
    rentPerSqm: 7,
    landPerSqm: 150,
    parkingPrice: 10000,
  },
];

const baseTemplates = [
  {
    listingType: ListingType.SELL,
    propertyType: PropertyType.APARTMENT,
    interiorType: InteriorType.FURNISHED,
    upkeepType: UpkeepType.EXCELLENT,
    heatingType: HeatingType.CENTRAL,
    areaTotal: 96,
    areaLiving: 82,
    areaOutside: 8,
    areaGarage: 0,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    floorNumber: 4,
    numberOfFloorsProperty: 1,
    numberOfFloorsCommon: 8,
    builtYear: 2018,
  },
  {
    listingType: ListingType.SELL,
    propertyType: PropertyType.HOUSE,
    interiorType: InteriorType.FURNISHED,
    upkeepType: UpkeepType.GOOD,
    heatingType: HeatingType.BOILER,
    areaTotal: 214,
    areaLiving: 178,
    areaLand: 560,
    areaOutside: 34,
    areaGarage: 28,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    numberOfFloorsProperty: 2,
    numberOfFloorsCommon: 2,
    builtYear: 2011,
  },
  {
    listingType: ListingType.RENT,
    propertyType: PropertyType.APARTMENT,
    interiorType: InteriorType.FURNISHED,
    upkeepType: UpkeepType.EXCELLENT,
    heatingType: HeatingType.CENTRAL,
    areaTotal: 68,
    areaLiving: 58,
    areaOutside: 5,
    areaGarage: 0,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    parking: 0,
    floorNumber: 5,
    numberOfFloorsProperty: 1,
    numberOfFloorsCommon: 9,
    builtYear: 2020,
  },
];

const specialTemplates = [
  {
    listingType: ListingType.SELL,
    propertyType: PropertyType.LAND,
    areaTotal: 780,
    areaLand: 780,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
  },
  {
    listingType: ListingType.SELL,
    propertyType: PropertyType.PARKING,
    areaTotal: 18,
    areaGarage: 18,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking: 1,
    upkeepType: UpkeepType.GOOD,
  },
  {
    listingType: ListingType.RENT,
    propertyType: PropertyType.HOUSE,
    interiorType: InteriorType.FURNISHED,
    upkeepType: UpkeepType.EXCELLENT,
    heatingType: HeatingType.BOILER,
    areaTotal: 160,
    areaLiving: 138,
    areaLand: 380,
    areaOutside: 24,
    areaGarage: 20,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    numberOfFloorsProperty: 2,
    numberOfFloorsCommon: 2,
    builtYear: 2016,
  },
  {
    listingType: ListingType.SELL,
    propertyType: PropertyType.APARTMENT,
    interiorType: InteriorType.UNFURNISHED,
    upkeepType: UpkeepType.GOOD,
    heatingType: HeatingType.CENTRAL,
    areaTotal: 122,
    areaLiving: 104,
    areaOutside: 10,
    areaGarage: 16,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    floorNumber: 2,
    numberOfFloorsProperty: 1,
    numberOfFloorsCommon: 6,
    builtYear: 2014,
  },
];

function euros(value) {
  return Math.round(value / 100) * 100;
}

function listingPrice(location, template) {
  if (template.propertyType === PropertyType.PARKING) {
    return template.listingType === ListingType.RENT
      ? Math.max(80, Math.round(location.parkingPrice / 220))
      : location.parkingPrice;
  }

  if (template.listingType === ListingType.RENT) {
    const area = template.areaLiving || template.areaTotal || 1;
    const typeMultiplier = template.propertyType === PropertyType.HOUSE ? 1.25 : 1;
    return euros(area * location.rentPerSqm * typeMultiplier);
  }

  if (template.propertyType === PropertyType.LAND) {
    return euros((template.areaLand || template.areaTotal) * location.landPerSqm);
  }

  if (template.propertyType === PropertyType.HOUSE) {
    return euros(
      template.areaLiving * location.pricePerSqm * 0.92 +
        (template.areaLand || 0) * location.landPerSqm * 0.35,
    );
  }

  return euros(template.areaTotal * location.pricePerSqm);
}

function descriptionFor(location, template, price) {
  const type = template.propertyType.toLowerCase();
  const purpose = template.listingType === ListingType.RENT ? "rent" : "sale";

  if (template.propertyType === PropertyType.LAND) {
    return `Regulated land plot for ${purpose} in ${location.neighborhood}, ${location.locality}. The plot has street access, a practical rectangular shape, and nearby utility connections. It is suitable for a single-family home, a small residential project, or a long-term investment.`;
  }

  if (template.propertyType === PropertyType.PARKING) {
    return `Secure parking space for ${purpose} in ${location.neighborhood}, ${location.locality}. The space is easy to access, close to residential buildings and daily services, and suitable for both owner use and investment.`;
  }

  return `Well-presented ${type} for ${purpose} in ${location.neighborhood}, ${location.locality}. The property offers ${template.rooms} rooms, ${template.bedrooms} bedrooms, practical storage, and comfortable living spaces. It is close to transport, shops, schools, and everyday services. Current asking price is ${price.toLocaleString("bg-BG", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}.`;
}

function keyPointsFor(location, template) {
  if (template.propertyType === PropertyType.LAND) {
    return [
      ["Regulated plot", "Suitable for residential construction with street access."],
      ["Utilities nearby", "Electricity and water connections are available in the area."],
      ["Strong location", `Quiet part of ${location.neighborhood} with good access to ${location.locality}.`],
    ];
  }

  if (template.propertyType === PropertyType.PARKING) {
    return [
      ["Easy access", "Comfortable entry and exit from the parking area."],
      ["Secure location", "Suitable for daily use or as an investment parking space."],
      ["Central demand", `Located near residential buildings in ${location.neighborhood}.`],
    ];
  }

  return [
    ["Functional layout", "Rooms are arranged for comfortable everyday use."],
    ["Good condition", "The property is ready for immediate use with minimal work."],
    ["Convenient area", `Close to transport, shops, and services in ${location.neighborhood}.`],
  ];
}

function listingImages(listingIndex) {
  return [0, 1, 2].map((offset) => {
    const url = imagePool[(listingIndex + offset) % imagePool.length];
    return {
      url,
      imagePath: url,
      positionInListing: offset,
    };
  });
}

function asCoordinate(value, offset) {
  return (value + offset).toFixed(6);
}

async function deleteExistingSeedData() {
  const seedUsers = await prisma.applicationUser.findMany({
    where: { email: { endsWith: `@${SEED_EMAIL_DOMAIN}` } },
    select: { id: true },
  });
  const seedUserIds = seedUsers.map((user) => user.id);

  if (seedUserIds.length > 0) {
    const seedListings = await prisma.listing.findMany({
      where: { applicationUserId: { in: seedUserIds } },
      select: { id: true },
    });
    const seedListingIds = seedListings.map((listing) => listing.id);

    if (seedListingIds.length > 0) {
      await prisma.sentNotificationSavedSearch.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.recentlyViewedListing.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.savedListing.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.listingDescriptionKeyPoint.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.listingImage.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.listingPrice.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.address.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.subscription.deleteMany({
        where: { listingId: { in: seedListingIds } },
      });
      await prisma.listing.deleteMany({
        where: { id: { in: seedListingIds } },
      });
    }

    const seedSavedSearches = await prisma.savedSearch.findMany({
      where: { applicationUserId: { in: seedUserIds } },
      select: { id: true },
    });
    const seedSavedSearchIds = seedSavedSearches.map((search) => search.id);

    if (seedSavedSearchIds.length > 0) {
      await prisma.sentNotificationSavedSearch.deleteMany({
        where: { savedSearchId: { in: seedSavedSearchIds } },
      });
      await prisma.savedSearch.deleteMany({
        where: { id: { in: seedSavedSearchIds } },
      });
    }

    await prisma.invoice.deleteMany({
      where: { applicationUserId: { in: seedUserIds } },
    });
    await prisma.companyMembershipInvite.deleteMany({
      where: {
        OR: [
          { applicationUserIdSender: { in: seedUserIds } },
          { applicationUserEmailReceiver: { endsWith: `@${SEED_EMAIL_DOMAIN}` } },
        ],
      },
    });
    await prisma.membership.deleteMany({
      where: { applicationUserId: { in: seedUserIds } },
    });
    await prisma.applicationUser.deleteMany({
      where: { id: { in: seedUserIds } },
    });
  }

  const seedCompanies = await prisma.company.findMany({
    where: { email: { endsWith: `@${SEED_EMAIL_DOMAIN}` } },
    select: { id: true },
  });
  const seedCompanyIds = seedCompanies.map((company) => company.id);

  if (seedCompanyIds.length > 0) {
    await prisma.companyMembershipInvite.deleteMany({
      where: { companyId: { in: seedCompanyIds } },
    });
    await prisma.membership.deleteMany({
      where: { companyId: { in: seedCompanyIds } },
    });
    await prisma.address.deleteMany({
      where: { companyId: { in: seedCompanyIds } },
    });
    await prisma.subscription.deleteMany({
      where: { companyId: { in: seedCompanyIds } },
    });
    await prisma.company.deleteMany({
      where: { id: { in: seedCompanyIds } },
    });
  }
}

async function createAgencies() {
  const createdAgencies = [];

  for (const agency of agencies) {
    const slug = agency.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const user = await prisma.applicationUser.create({
      data: {
        firebaseUID: `seed-${slug}`,
        email: `${slug}@${SEED_EMAIL_DOMAIN}`,
        displayName: agency.userName,
        providerId: "seed",
        phoneNumber: "+359 88 800 1000",
      },
    });

    const company = await prisma.company.create({
      data: {
        name: agency.companyName,
        email: `office-${slug}@${SEED_EMAIL_DOMAIN}`,
        phoneNumber: "+359 2 900 1000",
        description: `${agency.companyName} is a local agency focused on residential property sales and rentals.`,
        Address: {
          create: [
            {
              locality: agency.city,
              route: agency.route,
              streetNumber: agency.streetNumber,
              postalCode: agency.postalCode,
              latitude: agency.latitude,
              longitude: agency.longitude,
              showExactLocation: true,
            },
          ],
        },
      },
    });

    await prisma.membership.create({
      data: {
        applicationUserId: user.id,
        companyId: company.id,
        applicationUserRole: "OWNER",
        isActive: true,
      },
    });

    createdAgencies.push({ user, company });
  }

  return createdAgencies;
}

async function createListings(createdAgencies) {
  const now = Date.now();
  let listingIndex = 0;

  for (const [locationIndex, location] of locations.entries()) {
    const templates = [
      ...baseTemplates,
      specialTemplates[locationIndex % specialTemplates.length],
    ];

    for (const [templateIndex, template] of templates.entries()) {
      const agency = createdAgencies[listingIndex % createdAgencies.length];
      const price = listingPrice(location, template);
      const daysListed = (listingIndex * 3) % 48;
      const createdAt = new Date(now - daysListed * MS_PER_DAY);
      const activeUntil = new Date(now + (60 + (listingIndex % 30)) * MS_PER_DAY);
      const coordinateOffset = (templateIndex + 1) * 0.0011;
      const streetNumber = String(8 + listingIndex);
      const areaLand =
        template.propertyType === PropertyType.LAND
          ? template.areaLand
          : template.areaLand || null;

      await prisma.listing.create({
        data: {
          applicationUserId: agency.user.id,
          companyId: agency.company.id,
          listingType: template.listingType,
          interiorType: template.interiorType || null,
          upkeepType: template.upkeepType || null,
          propertyType: template.propertyType,
          description: descriptionFor(location, template, price),
          price,
          currency: Currency.EUR,
          locality: location.locality,
          areaTotal: template.areaTotal || null,
          areaLiving: template.areaLiving || null,
          areaLand,
          areaOutside: template.areaOutside || null,
          areaGarage: template.areaGarage || null,
          streetName: location.route,
          houseNumber: streetNumber,
          postalCode: location.postalCode,
          longitude: asCoordinate(location.longitude, coordinateOffset),
          latitude: asCoordinate(location.latitude, coordinateOffset),
          rooms: template.rooms || null,
          bathrooms: template.bathrooms || null,
          bedrooms: template.bedrooms || null,
          parking: template.parking || null,
          constructedYear: template.builtYear
            ? new Date(`${template.builtYear}-01-01T00:00:00.000Z`)
            : null,
          floorNumber: template.floorNumber || null,
          numberOfFloorsProperty: template.numberOfFloorsProperty || null,
          numberOfFloorsCommon: template.numberOfFloorsCommon || null,
          heatingType: template.heatingType || null,
          active: true,
          activeUntil,
          createdAt,
          Address: {
            create: [
              {
                streetNumber,
                route: location.route,
                administrativeAreaLevelOne: "Bulgaria",
                locality: location.locality,
                postalCode: location.postalCode,
                neighborhood: location.neighborhood,
                latitude: asCoordinate(location.latitude, coordinateOffset),
                longitude: asCoordinate(location.longitude, coordinateOffset),
                showExactLocation: template.propertyType !== PropertyType.LAND,
              },
            ],
          },
          ListingImage: {
            create: listingImages(listingIndex),
          },
          ListingPrice: {
            create: [
              {
                currency: Currency.EUR,
                price: Math.round(price * 1.05),
                tax: null,
                createdAt: new Date(createdAt.getTime() - 18 * MS_PER_DAY),
              },
              {
                currency: Currency.EUR,
                price,
                tax: null,
                createdAt,
              },
            ],
          },
          listingDescriptionKeyPoints: {
            create: keyPointsFor(location, template).map(([title, description]) => ({
              title,
              description,
            })),
          },
        },
      });

      listingIndex += 1;
    }
  }

  return listingIndex;
}

async function main() {
  await deleteExistingSeedData();
  const createdAgencies = await createAgencies();
  const listingCount = await createListings(createdAgencies);

  console.log(
    `Seeded ${listingCount} listings, ${createdAgencies.length} agencies, and ${createdAgencies.length} seed users.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
