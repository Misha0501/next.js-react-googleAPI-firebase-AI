"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import { Grid } from "@mui/material";
import StepLabel from "@mui/material/StepLabel";
import GeneralInfo from "./GeneralInfo";
import MoreDetails from "./MoreDetails";
import DescriptionAndImages from "./DescriptionAndImages";
import Confirmation from "./Confirmation";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { MuiStepper } from "./Styled";

const steps = [
  "General information",
  "More details",
  "Description & images",
  "Confirmation",
];

const initialImages: any = [];

export default function MultiForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [showForm1, setShowForm1] = useState(true);
  const [showForm2, setShowForm2] = useState(true);
  const [showForm3, setShowForm3] = useState(true);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackStep1 = () => {
    setShowForm1(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleBackStep2 = () => {
    setShowForm2(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleBackStep3 = () => {
    setShowForm3(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  interface CreatePropertyFormikPropInterface {
    listingType: string;
    propertyType: string;
    address: string;
    streetNumber: string;
    route: string;
    locality: string;
    neighborhood: string;
    administrativeArea: string;
    postalCode: string;
    latitude: string;
    longitude: string;
    currency: string;
    price: number | string;
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
    totalArea?: number;
    livingArea?: number;
    areaOutside?: number;
    areaGarage?: number;
    volume?: number;
    interiorType?: string;
    upkeepType?: string;
    heatingType?: string;
    constructedYear?: number;
    numberOfFloorsCommon?: number;
    floorNumber?: number;
    buildingType?: string;
    characteristics?: string;
    description?: string;
    images: any;
  }

  const formContent = (
    step: number,
    formik: FormikProps<CreatePropertyFormikPropInterface>
  ) => {
    switch (step) {
      case 0:
        return (
          <GeneralInfo
            isShow={showForm1}
            formik={formik}
            handleNext={handleNext}
            step={step}
          />
        );
      case 1:
        return (
          <MoreDetails
            isShow={showForm2}
            handleBack={handleBackStep1}
            formik={formik}
            handleNext={handleNext}
            step={step}
          />
        );
      case 2:
        return (
          <DescriptionAndImages
            isShow={showForm3}
            handleBack={handleBackStep2}
            formik={formik}
            handleNext={handleNext}
            step={step}
            // FieldArray={FieldArray}
          />
        );
      case 3:
        return (
          <Confirmation
            isShow={showForm3}
            formik={formik}
            // handleSubmit={formik.handleSubmit}
            handleBack={handleBackStep3}
            step={step}
          />
        );
      default:
        return <div>404: Not Found</div>;
    }
  };

  return (
    <div className="py-11">
      <Formik
        initialValues={{
          listingType: "RENT",
          propertyType: "",
          address: "",
          streetNumber: "",
          route: "",
          locality: "",
          neighborhood: "",
          administrativeArea: "",
          postalCode: "",
          latitude: "",
          longitude: "",
          currency: "",
          price: 0 as string | number,
          rooms: undefined,
          bedrooms: undefined,
          bathrooms: undefined,
          totalArea: undefined,
          livingArea: undefined,
          areaOutside: undefined,
          areaGarage: undefined,
          volume: undefined,
          interiorType: undefined,
          upkeepType: "",
          heatingType: "",
          constructedYear: undefined,
          numberOfFloorsCommon: undefined,
          floorNumber: undefined,
          buildingType: undefined,
          characteristics: undefined,
          description: undefined,
          images: initialImages,
        }}
        validationSchema={Yup.object().shape({
          listingType: Yup.string().required("Listing type is required"),
          propertyType: Yup.string(),
          address: Yup.string().required("Address is required"),
          streetNumber: Yup.string(),
          administrativeArea: Yup.string(),
          currency: Yup.string().required("Currency is required"),
          price: Yup.number().positive().required("Price is required"),
          rooms: Yup.number(),
          bedrooms: Yup.number(),
          bathrooms: Yup.number(),
          totalArea: Yup.number(),
          livingArea: Yup.number(),
          areaOutside: Yup.number(),
          areaGarage: Yup.number(),
          volume: Yup.number(),
          interiorType: Yup.string().required("interior type is required"),
          upkeepType: Yup.string().required("upkeep type is required"),
          heatingType: Yup.string().required("heating type is required"),
          constructedYear: Yup.number(),
          numberOfFloorsCommon: Yup.number(),
          floorNumber: Yup.number(),
          buildingType: Yup.string(),
          characteristics: Yup.string(),
          description: Yup.string().required("description is required"),
        })}
        onSubmit={(values) => {
          alert(values);
          if (activeStep === steps.length - 1) {
          } else {
            setActiveStep((prevStep) => prevStep + 1);
          }
        }}
      >
        {(formik) => (
          <form>
            <div className="pt-10 pb-10">
              <Box>
                <div className="bg-[#F2F2F2] shadow-[0_4px_20px_0px_rgba(0,0,0,0.1)]">
                  <MuiStepper
                    className="max-w-screen-xl hidden m-auto items-stretch md:flex"
                    activeStep={activeStep}
                    orientation="horizontal"
                  >
                    {steps.map((label, index) => (
                      <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </MuiStepper>
                </div>
                <Grid container>
                  <Grid item xs={12} sx={{ padding: "20px" }}>
                    {formContent(activeStep, formik as any)}
                  </Grid>
                </Grid>
              </Box>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
