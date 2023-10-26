import { prisma } from "@/app/lib/db/client";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { ApplicationUser, Listing } from "@/types";
import { getApplicationUserCompanyId } from "@/app/lib/listing/getApplicationUserCompanyId";
import { userAllowedManipulateListing } from "@/app/lib/listing/userAllowedManipulateListing";

export const validateId = (slug: number): number => {
  const id = Number(slug);
  if (isNaN(id)) throw new ResponseError("ID must be a valid number", 422);
  return id;
};

export const fetchImageById = async (id: number) => {
  const image = await prisma.listingImage.findUnique({
    where: {
      id
    },
  });
  const listingId = image?.listingId;
  if (!listingId) throw new ResponseError("Listing with provided image id wasn't found.", 404);
  return { image, listingId };
};

export const ensureListingAndUserPermissions = async (applicationUser: ApplicationUser, listingId: number) => {
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
      deleted: null,
    },
  });
  if (!listing) throw new ResponseError("Listing with provided image id wasn't found.", 404);
  const applicationUserCompanyId = getApplicationUserCompanyId(applicationUser);
  if (!userAllowedManipulateListing(applicationUser.id, applicationUserCompanyId, listing)) {
    throw new ResponseError("You aren't allowed to changed this property", 401);
  }
};

export const deleteImageFromDB = async (id: number) => {
  await prisma.listingImage.delete({
    where: { id },
  });
};

