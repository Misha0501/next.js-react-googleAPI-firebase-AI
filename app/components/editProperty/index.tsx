"use client";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams } from "next/navigation";
import EditForm from "./EditForm";

export default function EditProperty() {
  const params = useParams();
  const listingDetailPage = useListingDetailPage({ id: Number(params?.id) });
  return (
    <div className={"py-11"}>
      <div className="container">
        <p className={"font-semibold text-3xl mt-4"}>Edit Your Property</p>
        <Formik
          initialValues={{
            listingType: listingDetailPage?.data?.listingType,
            propertyType: listingDetailPage?.data?.propertyType,
            streetNumber: listingDetailPage?.data?.Address?.[0].route,
            route: listingDetailPage?.data?.Address?.[0].route,
            locality: listingDetailPage?.data?.Address?.[0].locality,
            administrativeArea:
              listingDetailPage?.data?.Address?.[0].administrativeAreaLevelOne,
            postalCode: listingDetailPage?.data?.Address?.[0].postalCode,
            latitude: listingDetailPage?.data?.Address?.[0]?.latitude,
            longitude: listingDetailPage?.data?.Address?.[0].longitude,
            currency: listingDetailPage?.data?.currency,
            price: listingDetailPage?.data?.price,
            rooms: listingDetailPage?.data?.rooms,
            bedrooms: listingDetailPage?.data?.bedrooms,
            bathrooms: listingDetailPage?.data?.bathrooms,
            totalArea: listingDetailPage?.data?.areaTotal,
            livingArea: listingDetailPage?.data?.areaLiving,
            areaOutside: listingDetailPage?.data?.areaOutside,
            areaGarage: listingDetailPage?.data?.areaGarage,
            volume: listingDetailPage?.data?.volume,
            interiortype: listingDetailPage?.data?.interiorType,
            upkeeptype: listingDetailPage?.data?.upkeepType,
            heatingtype: listingDetailPage?.data?.heatingType,
            constructedYear: listingDetailPage?.data?.constructedYear,
            numberOfFloorsCommon: listingDetailPage?.data?.numberOfFloorsCommon,
            floorNumber: listingDetailPage?.data?.floorNumber,
            description: listingDetailPage?.data?.description,
            images: listingDetailPage?.data?.ListingImage,
          }}
          validationSchema={Yup.object().shape({
            listingType: Yup.string().required("Listing type is required"),
            propertyType: Yup.string().required("Property Type is required"),
            currency: Yup.string().required("Currency is required"),
            price: Yup.number().required("Price is required"),
            rooms: Yup.number(),
            bedrooms: Yup.number(),
            bathrooms: Yup.number(),
            totalArea: Yup.number().required("Total Area Requried"),
            livingArea: Yup.number(),
            areaOutside: Yup.number(),
            garden: Yup.number(),
            areaGarage: Yup.number(),
            volume: Yup.number(),
            interiortype: Yup.string().required("interior type is required"),
            upkeeptype: Yup.string().required("Property condition is required"),
            heatingtype: Yup.string().required("heating type is required"),
            constructedYear: Yup.number(),
            numberOfFloorsCommon: Yup.number(),
            floorNumber: Yup.number(),
            description: Yup.string(),
          })}
          enableReinitialize={true}
          onSubmit={(values) => {}}
        >
          {(formik) => (
            <EditForm
              id={listingDetailPage?.data?.id}
              addressId={listingDetailPage?.data?.Address?.[0]?.id}
              formik={formik}
              loading={listingDetailPage?.isLoading}
            />
          )}
        </Formik>
      </div>
    </div>
  );
}
