import { NextRequest } from "next/server";
import { valuesFromSearchParams } from "@/app/lib/validations/valuesFromSearchParams";
import { listingsSearchParamSchema } from "@/app/lib/validations/listing";
import {
  prismaQueryConditionsFromArray,
  prismaQueryConditionsFromMinMaxValidDateStringValue,
  prismaQueryConditionsFromMinMaxValue
} from "@/app/lib/db";

/**
 * Extract and validate parameters from the request.
 */
export const extractParametersGET = (req: NextRequest) => {
  const url = new URL(req.url);
  const values = valuesFromSearchParams(url.searchParams);
  return listingsSearchParamSchema.parse(values);
}

/**
 * Build Prisma query conditions based on provided parameters.
 */
export const buildPrismaQueryConditions = (params: any) => {
  // Extract parameters
  let {
    page,
    pageSize,
    locality,
    heatingType,
    listingType,
    interiorType,
    propertyType,
    currencyType,
    upkeepType,
    areaTotalMin,
    areaTotalMax,
    areaLivingMin,
    areaLivingMax,
    areaLandMin,
    areaLandMax,
    areaOutsideMin,
    areaOutsideMax,
    roomsMin,
    roomsMax,
    bathroomsMin,
    bathroomsMax,
    bedroomsMin,
    bedroomsMax,
    parkingMin,
    parkingMax,
    constructedYearMin,
    constructedYearMax,
    listedSince,
    priceMin,
    priceMax,
  } = params;

  // Prisma where object that that will be field with conditions
  let prismaQueryConditions: any = {
    AND: [],
  };

  const heatingTypeWhereObj = prismaQueryConditionsFromArray(
    heatingType,
    "heatingType",
  );
  const listingTypeWhereObj = prismaQueryConditionsFromArray(
    listingType,
    "listingType",
  );
  const interiorTypeWhereObj = prismaQueryConditionsFromArray(
    interiorType,
    "interiorType",
  );
  const propertyTypeWhereObj = prismaQueryConditionsFromArray(
    propertyType,
    "propertyType",
  );
  const upkeepTypeWhereObj = prismaQueryConditionsFromArray(
    upkeepType,
    "upkeepType",
  );
  const currencyTypeWhereObj = prismaQueryConditionsFromArray(
    currencyType,
    "currencyType",
  );
  const areaTotalWhereObj = prismaQueryConditionsFromMinMaxValue(
    areaTotalMin,
    areaTotalMax,
    "areaTotal",
  );
  const areaLivingWhereObj = prismaQueryConditionsFromMinMaxValue(
    areaLivingMin,
    areaLivingMax,
    "areaLiving",
  );
  const areaLandWhereObj = prismaQueryConditionsFromMinMaxValue(
    areaLandMin,
    areaLandMax,
    "areaLand",
  );
  const areaOutsideWhereObj = prismaQueryConditionsFromMinMaxValue(
    areaOutsideMin,
    areaOutsideMax,
    "areaOutside",
  );
  const roomsWhereObj = prismaQueryConditionsFromMinMaxValue(
    roomsMin,
    roomsMax,
    "rooms",
  );
  const bathroomsWhereObj = prismaQueryConditionsFromMinMaxValue(
    bathroomsMin,
    bathroomsMax,
    "bathrooms",
  );
  const bedroomsWhereObj = prismaQueryConditionsFromMinMaxValue(
    bedroomsMin,
    bedroomsMax,
    "bedrooms",
  );
  const parkingWhereObj = prismaQueryConditionsFromMinMaxValue(
    parkingMin,
    parkingMax,
    "parking",
  );
  const priceWhereObj = prismaQueryConditionsFromMinMaxValue(
    priceMin,
    priceMax,
    "price",
  );
  const constructedYearWhereObj =
    prismaQueryConditionsFromMinMaxValidDateStringValue(
      constructedYearMin,
      constructedYearMax,
      "constructedYear",
    );

  // set listed since
  const now = new Date();
  if (listedSince)
    prismaQueryConditions["createdAt"] = {
      gte: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - listedSince,
      ),
    };

  // set locality
  if (locality) {
    prismaQueryConditions["Address"] = {
      some: {
        locality: locality,
      },
    };
  }

  prismaQueryConditions.AND.push(
    heatingTypeWhereObj,
    listingTypeWhereObj,
    interiorTypeWhereObj,
    propertyTypeWhereObj,
    upkeepTypeWhereObj,
    areaTotalWhereObj,
    areaLivingWhereObj,
    areaLandWhereObj,
    areaOutsideWhereObj,
    roomsWhereObj,
    bathroomsWhereObj,
    bedroomsWhereObj,
    parkingWhereObj,
    constructedYearWhereObj,
    priceWhereObj,
    currencyTypeWhereObj,
  );

  return prismaQueryConditions;
}
