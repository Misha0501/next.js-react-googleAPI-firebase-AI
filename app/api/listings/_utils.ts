import { NextRequest } from "next/server";
import { valuesFromSearchParams } from "@/app/lib/validations/valuesFromSearchParams";
import { listingsSearchParamSchema } from "@/app/lib/validations/listing";
import {
  prismaQueryConditionsFromArray,
  prismaQueryConditionsFromMinMaxValidDateStringValue,
  prismaQueryConditionsFromMinMaxValue
} from "@/app/lib/db";
import { prisma } from "@/app/lib/db/client";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import { userAllowedManipulateListing } from "@/app/lib/listing/userAllowedManipulateListing";
import { ApplicationUser } from "@prisma/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";

/**
 * Extracts and validates parameters from the request.
 *
 * @param {NextRequest} req - The request object.
 * @returns {any} - The parsed and validated parameters.
 */
export const extractParametersGET = (req: NextRequest): any => {
  const url = new URL(req.url);
  const values = valuesFromSearchParams(url.searchParams);
  return listingsSearchParamSchema.parse(values);
};

/**
 * Builds Prisma query conditions based on the provided parameters.
 *
 * @param {any} params - The parameters to be used for creating the query conditions.
 * @returns - The Prisma query conditions.
 */
export const buildPrismaQueryConditions = (params: any) => {
  // Extract parameters
  const {
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
};

/**
 * Handles the update of images for a listing.
 *
 * @param {number} id - The listing id.
 * @param {any[]} images - Array of images to be updated.
 */
export const handleImagesUpdate = async (id: number, images: any[]) => {
  for (const image of images) {
    if (!image.id) {
      await prisma.listingImage.create({
        data: { ...image, listingId: id },
      });
    } else {
      await prisma.listingImage.update({
        where: { id: image.id, listingId: id },
        data: { ...image },
      });
    }
  }
};

/**
 * Handles the update of address for a listing.
 *
 * @param {number} id - The listing id.
 * @param {any} address - The address to be updated.
 */
export const handleAddressUpdate = async (id: number, address: any) => {
  if (address) {
    await prisma.address.update({
      where: { id: address.id, listingId: id },
      data: { ...address },
    });
  }
};

/**
 * Handles the update of price for a listing.
 *
 * @param {number} id - The listing id.
 * @param {number | undefined} price - The price to be updated.
 * @param {string | undefined} currency - The currency of the price.
 */
export const handlePriceUpdate = async (
  id: number,
  price: number | undefined,
  currency: string | undefined,
) => {
  if (price && currency) {
    const listingPrice = await prisma.listingPrice.findMany({
      where: { listingId: id, price, currency },
      orderBy: { id: "desc" },
      take: 1,
    });

    if (!listingPrice || listingPrice.length === 0) {
      await prisma.listingPrice.create({
        data: { listingId: id, price, currency },
      });
    }
  }
};

/**
 * Validates if a listing exists.
 *
 * @param {number} id - The ID of the listing.
 * @returns - The found listing.
 */
export const validateListingExistence = async (id: number) => {
  const listing = await prisma.listing.findUnique({
    where: {
      id,
      deleted: null,
    },
  });
  if (!listing)
    throw new ResponseError("Listing with provided id wasn't found.", 404);
  return listing;
};

/**
 * Ensures that the user has access to manipulate the listing.
 *
 * @param {ApplicationUser} applicationUser - The application user object.
 * @param {any} listing - The listing object.
 */
export const ensureUserHasListingAccess = (
  applicationUser: ApplicationUser,
  listing: any,
) => {
  const applicationUserId = applicationUser.id;
  const applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);
  if (
    !userAllowedManipulateListing(
      applicationUserId,
      applicationUserCompanyId,
      listing,
    )
  ) {
    throw new ResponseError("You aren't allowed to changed this property", 401);
  }
};

/**
 * Deletes a listing and its associated entities (images, address, prices).
 *
 * @param {number} id - The ID of the listing to be deleted.
 */
export const deleteListingAndAssociatedEntities = async (id: number) => {
  const deleteListingImages = prisma.listingImage.deleteMany({
    where: {
      listingId: id,
    },
  });
  const deleteListingAddress = prisma.address.deleteMany({
    where: {
      listingId: id,
    },
  });
  const deleteListingPrices = prisma.listingPrice.deleteMany({
    where: {
      listingId: id,
    },
  });
  const deleteListing = prisma.listing.delete({
    where: { id },
  });
  await prisma.$transaction([
    deleteListingImages,
    deleteListingAddress,
    deleteListingPrices,
    deleteListing,
  ]);
};
