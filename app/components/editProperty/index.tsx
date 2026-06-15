"use client";

import React from "react";
import { Formik } from "formik";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams } from "next/navigation";
import EditForm, { EditPropertyValues } from "./EditForm";
import { ListingImage } from "@/types";

const getYearValue = (value?: string | null) => {
  if (!value) return undefined;

  const year = new Date(value).getFullYear();

  return Number.isFinite(year) ? year : undefined;
};

export default function EditProperty() {
  const params = useParams();
  const listingDetailPage = useListingDetailPage({ id: Number(params?.id) });
  const listing = listingDetailPage.data;
  const address = listing?.Address?.[0];
  const initialValues: EditPropertyValues = {
    listingType: listing?.listingType || "SELL",
    propertyType: listing?.propertyType || "",
    streetNumber: address?.streetNumber || "",
    route: address?.route || "",
    locality: address?.locality || "",
    neighborhood: address?.neighborhood || "",
    administrativeArea: address?.administrativeAreaLevelOne || "",
    postalCode: address?.postalCode || "",
    latitude: address?.latitude || "",
    longitude: address?.longitude || "",
    currency: listing?.currency || "EUR",
    price: listing?.price || 0,
    rooms: listing?.rooms ?? undefined,
    bedrooms: listing?.bedrooms ?? undefined,
    bathrooms: listing?.bathrooms ?? undefined,
    parking: listing?.parking ?? undefined,
    totalArea: listing?.areaTotal ?? undefined,
    livingArea: listing?.areaLiving ?? undefined,
    areaOutside: listing?.areaOutside ?? undefined,
    areaGarage: listing?.areaGarage ?? undefined,
    volume: listing?.volume ?? undefined,
    interiorType: listing?.interiorType || "",
    upkeepType: listing?.upkeepType || "",
    heatingType: listing?.heatingType || "",
    constructedYear: getYearValue(listing?.constructedYear),
    numberOfFloorsCommon: listing?.numberOfFloorsCommon ?? undefined,
    floorNumber: listing?.floorNumber ?? undefined,
    description: listing?.description || "",
    images: (listing?.ListingImage || []) as ListingImage[],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
            Property management
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[#1F2937] md:text-5xl">
                Edit your property.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#596579] md:text-base">
                Update the live property details, images and description from
                one focused editor.
              </p>
            </div>
            {listing?.id && (
              <div className="rounded-xl border border-[#CFE0FF] bg-[#EAF2FF] px-4 py-3 text-sm font-semibold text-[#1F5FD6]">
                Property #{listing.id}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {listingDetailPage.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm font-semibold text-red-700">
            Could not load this property. Please try again later.
          </div>
        ) : (
          <Formik<EditPropertyValues>
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={() => undefined}
          >
            {(formik) => (
              <EditForm
                id={listing?.id}
                addressId={address?.id}
                formik={formik}
                loading={listingDetailPage.isLoading}
              />
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
