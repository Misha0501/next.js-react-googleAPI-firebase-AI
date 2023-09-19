"use client";
import React, { useState } from "react";
import { GoBackBtn } from "../GoBackBtn";
import { Formik } from "formik"; // Import Formik components
import * as Yup from "yup";
import { useListingDetailPage } from "@/providers/Listing";
import { useParams } from "next/navigation";
import { FormHelperText } from "@mui/material";
import EditForm from "./EditForm";

const InitalImages: any = [];

export default function EditProperty() {
  const params = useParams();
  const listingDetailPage = useListingDetailPage({ id: Number(params?.id) });
  return (
    <div className="py-11 max-w-screen-xl m-auto">
      <GoBackBtn
        //@ts-ignore
        label="Back to account"
        className="text-black"
      />
      <p className={"font-semibold text-[40px] mt-4"}>Edit Your Property</p>

      <Formik
        initialValues={{
          listingType: listingDetailPage?.data?.listingType,
          propertyType: listingDetailPage?.data?.propertyType,
          streetNumber: listingDetailPage?.data?.Address?.[0].streetNumber,
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
          totalarea: listingDetailPage?.data?.areaTotal,
          livingarea: listingDetailPage?.data?.areaLiving,
          outsidearea: listingDetailPage?.data?.areaOutside,
          garden: listingDetailPage?.data?.areaGarden,
          garage: listingDetailPage?.data?.areaGarage,
          volume: listingDetailPage?.data?.volume,
          interiortype: listingDetailPage?.data?.interiorType,
          upkeeptype: listingDetailPage?.data?.upkeepType,
          heatingtype: listingDetailPage?.data?.heatingType,
          yearBuilt: listingDetailPage?.data?.constructedYear,
          numberOfFloorsCommon: listingDetailPage?.data?.numberOfFloorsCommon,
          floorNumber: listingDetailPage?.data?.floorNumber,
          discription: listingDetailPage?.data?.description,
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
          totalarea: Yup.number().required("Total Area Requried"),
          livingarea: Yup.number(),
          outsidearea: Yup.number(),
          garden: Yup.number(),
          garage: Yup.number(),
          volume: Yup.number(),
          interiortype: Yup.string().required("interior type is required"),
          upkeeptype: Yup.string().required("Property condition is required"),
          heatingtype: Yup.string().required("heating type is required"),
          yearBuilt: Yup.number(),
          numberOfFloorsCommon: Yup.number(),
          floorNumber: Yup.number(),
          discription: Yup.string(),
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
  );
}
