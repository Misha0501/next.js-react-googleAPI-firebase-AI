"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import { Grid, Typography } from "@mui/material";
import StepLabel from "@mui/material/StepLabel";
import LinearProgress from "@mui/material/LinearProgress";

import { GoBackBtn } from "../GoBackBtn";
import GeneralInfo from "./GeneralInfo";
import MoreDetails from "./MoreDetails";
import DescriptionAndImages from "./DescriptionAndImages";
import Confirmation from "./Confirmation";
import { Formik, FieldArray } from "formik"; // Import Formik components
import * as Yup from "yup";
import { MuiStepper } from "./Styled";

const steps = [
  "General information",
  "More details",
  "Description & images",
  "Confirmation",
];

const InitalImages: any = [];

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

  const handleReset = () => {
    setActiveStep(0);
  };

  const formContent = (step: number, formik: any) => {
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
            FieldArray={FieldArray}
          />
        );
      case 3:
        return (
          <Confirmation
            isShow={showForm3}
            formik={formik}
            handleSubmit={formik.handleSubmit}
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
      <div className="max-w-screen-xl m-auto">
        <GoBackBtn
          //@ts-ignore
          label="Back to account"
          className="text-black"
        />
      </div>

      <Formik
        initialValues={{
          listingType: "RENT",
          propertyType: undefined,
          address: "",
          streetNumber: "",
          route: "",
          locality: "",
          administrativeArea: "",
          postalCode: "",
          latitude: "",
          longitude: "",
          currency: "",
          price: undefined,
          rooms: undefined,
          bedrooms: undefined,
          bathrooms: undefined,
          totalarea: undefined,
          livingarea: undefined,
          outsidearea: undefined,
          garden: undefined,
          garage: undefined,
          volume: undefined,
          interiortype: undefined,
          upkeeptype: "",
          heatingtype: "",
          yearBuilt: undefined,
          numberOfFloorsCommon: undefined,
          floorNumber: undefined,
          buildingtype: undefined,
          characteristics: undefined,
          discription: undefined,
          images: InitalImages,
        }}
        validationSchema={Yup.object().shape({
          listingType: Yup.string().required("Listing type is required"),
          propertyType: Yup.string(),
          address: Yup.string().required("Address is required"),
          streetNumber: Yup.string(),
          administrativeArea: Yup.string(),
          currency: Yup.string().required("Currency is required"),
          price: Yup.number().required("Price is required"),
          rooms: Yup.number(),
          bedrooms: Yup.number(),
          bathrooms: Yup.number(),
          totalarea: Yup.number(),
          livingarea: Yup.number(),
          outsidearea: Yup.number(),
          garden: Yup.number(),
          garage: Yup.number(),
          volume: Yup.number(),
          interiortype: Yup.string().required("interior type is required"),
          upkeeptype: Yup.string().required("upkeep type is required"),
          heatingtype: Yup.string().required("heating type is required"),
          yearBuilt: Yup.number(),
          numberOfFloorsCommon: Yup.number(),
          floorNumber: Yup.number(),
          buildingtype: Yup.string(),
          characteristics: Yup.string(),
          discription: Yup.string().required("discription is required"),
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
                <div className=" bg-[#F2F2F2] shadow-[0_4px_20px_0px_rgba(0,0,0,0.1)]">
                  <MuiStepper
                    className="max-w-screen-xl m-auto"
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
                    {formContent(activeStep, formik)}
                  </Grid>
                </Grid>

                <LinearProgress
                  sx={{
                    height: "30px",
                    marginTop: "30px",
                    backgroundColor: "#F2F2F2",
                    color: "#97B6FF",
                  }}
                  variant="determinate"
                  value={(activeStep / 4) * 100}
                  aria-label="hell"
                />
                <Typography
                  fontWeight="semi-bold"
                  fontSize="16px"
                  textAlign="center"
                  sx={{ mt: "5px" }}
                >
                  {(activeStep / 4) * 100}%
                </Typography>
              </Box>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
