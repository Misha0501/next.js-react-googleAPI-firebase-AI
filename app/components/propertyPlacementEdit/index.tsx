"use client";
import React, { useState } from "react";
import GeneralInfo from "./GeneralInfo";
import MoreDetails from "./MoreDetails";
import DescriptionAndImages from "./DescriptionAndImages";
import Confirmation from "./Confirmation";
import { Formik, FormikProps } from "formik";
import {
  CheckBadgeIcon,
  ClipboardDocumentListIcon,
  HomeModernIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { PlacementFormValues } from "./validation";

const steps = [
  {
    title: "General information",
    description: "Intent, property type, address and price",
    icon: HomeModernIcon,
  },
  {
    title: "More details",
    description: "Spaces, dimensions and condition",
    icon: ClipboardDocumentListIcon,
  },
  {
    title: "Description & images",
    description: "Photos and description",
    icon: PhotoIcon,
  },
  {
    title: "Confirmation",
    description: "Review and publish",
    icon: CheckBadgeIcon,
  },
];

const initialValues: PlacementFormValues = {
  listingType: "SELL",
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
  currency: "EUR",
  price: 0,
  rooms: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  parking: undefined,
  totalArea: undefined,
  livingArea: undefined,
  areaOutside: undefined,
  areaGarage: undefined,
  volume: undefined,
  interiorType: "",
  upkeepType: "",
  heatingType: "",
  constructedYear: undefined,
  numberOfFloorsCommon: undefined,
  floorNumber: undefined,
  buildingType: undefined,
  characteristics: undefined,
  description: undefined,
  images: [],
};

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

  const formContent = (
    step: number,
    formik: FormikProps<PlacementFormValues>,
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Formik initialValues={initialValues} onSubmit={() => undefined}>
        {(formik) => (
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="border-b border-slate-200 bg-white">
              <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
                  Property placement
                </p>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[#1F2937] md:text-5xl">
                      Create a property page that feels ready for serious
                      buyers.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-[#596579] md:text-base">
                      Work through the details step by step. Required fields are
                      checked before you move forward, so the final property is
                      complete before it is published.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#CFE0FF] bg-[#EAF2FF] px-4 py-3 text-sm font-semibold text-[#1F5FD6]">
                    Step {activeStep + 1} of {steps.length}
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8">
                <div className="hidden grid-cols-4 gap-3 lg:grid">
                  {steps.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === activeStep;
                    const isDone = index < activeStep;

                    return (
                      <div
                        key={item.title}
                        className={`rounded-2xl border p-4 transition ${
                          isActive
                            ? "border-[#1F5FD6] bg-[#F6F9FF] shadow-sm"
                            : isDone
                              ? "border-[#CFE0FF] bg-white"
                              : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isActive || isDone
                                ? "bg-[#1F5FD6] text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-[#1F2937]">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#64748B]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="lg:hidden">
                  <div className="mb-3 flex gap-1.5">
                    {steps.map((item, index) => (
                      <span
                        key={item.title}
                        className={`h-1.5 flex-1 rounded-full transition ${
                          index <= activeStep ? "bg-[#1F5FD6]" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-[#1F2937]">
                    {steps[activeStep].title}
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {steps[activeStep].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
              {formContent(activeStep, formik)}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
