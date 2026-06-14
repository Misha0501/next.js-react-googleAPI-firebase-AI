import StepsTopInfo from "./StepsTopInfo";
import property1 from "@/public/property1.png";
import { useState } from "react";
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  FireIcon,
  HomeModernIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  HEATING_TYPES,
  INTERIOR_TYPES,
  UPKEEP_TYPES,
} from "../../lib/constants";
import SingleSelectRadioButton from "./SingleSelectRadioButton";
import { FormikProps } from "formik";
import {
  applyStepErrors,
  getMoreDetailsFields,
  PlacementFormValues,
  validateMoreDetails,
} from "./validation";

interface CreatePropertyComponentPropInterface {
  formik: FormikProps<PlacementFormValues>;
  handleNext: () => void;
  handleBack: () => void;
  step: number;
  isShow: boolean;
}

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

type NumberFieldProps = {
  formik: FormikProps<PlacementFormValues>;
  name: keyof PlacementFormValues;
  label: string;
  unit?: string;
  min?: number;
  max?: number;
  error?: string;
};

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

const ErrorText = ({ children }: { children?: React.ReactNode }) => {
  if (!children) return null;

  return <p className="mt-2 text-sm font-semibold text-red-600">{children}</p>;
};

const SectionRow = ({ icon, title, description, children }: SectionProps) => (
  <section className="grid gap-5 border-b border-slate-200 py-8 last:border-b-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
        {icon}
      </span>
      <div>
        <h3 className="text-xl font-bold text-[#1F2937]">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">
          {description}
        </p>
      </div>
    </div>
    <div>{children}</div>
  </section>
);

const NumberField = ({
  formik,
  name,
  label,
  unit,
  min = 0,
  max,
  error,
}: NumberFieldProps) => {
  const value = formik.values[name] ?? "";

  return (
    <div>
      <label
        className="mb-2 block text-sm font-bold text-[#1F2937]"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          min={min}
          max={max}
          value={value as string | number}
          onChange={(event) => {
            formik.setFieldValue(
              name,
              event.target.value === ""
                ? undefined
                : Number(event.target.value),
              true,
            );
          }}
          onBlur={formik.handleBlur}
          className={`${inputClass} ${unit ? "pr-12" : ""}`}
          placeholder="0"
        />
        {unit && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
            {unit}
          </span>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
    </div>
  );
};

const MoreDetails = ({
  formik,
  handleBack,
  step,
  handleNext,
  isShow,
}: CreatePropertyComponentPropInterface) => {
  const [show, setShow] = useState(true);
  const [showError, setShowErrors] = useState(false);
  const title = "Shape the property profile";
  const stepNumber = "Step 2";
  const isLand = formik.values.propertyType === "LAND";
  const tenYearsFromNow = new Date().getFullYear() + 10;

  const handleContinue = () => {
    const errors = validateMoreDetails(formik.values);
    applyStepErrors(formik, getMoreDetailsFields(formik.values), errors);

    if (Object.keys(errors).length === 0) {
      handleNext();
      return;
    }

    setShowErrors(true);
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      {show && isShow ? (
        <StepsTopInfo
          stepNumber={stepNumber}
          title="Add the details buyers compare"
          description="Add the size, layout, condition and building information. Land listings stay focused on area, while homes and apartments include comfort and building details."
          imageSrc={property1}
          step={step}
          handleBack={handleBack}
          onClick={() => setShow(false)}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
            {stepNumber}
          </div>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B] md:text-base">
              Focus on the data people scan first: size, layout, parking and
              condition.
            </p>
          </div>

          <div className="mt-4">
            {!isLand && (
              <SectionRow
                icon={<HomeModernIcon className="h-5 w-5" />}
                title="Rooms and parking"
                description="Add the key numbers buyers use to compare homes quickly."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField
                    formik={formik}
                    name="rooms"
                    label="Rooms"
                    error={showError ? (formik.errors.rooms as string) : ""}
                  />
                  <NumberField
                    formik={formik}
                    name="bedrooms"
                    label="Bedrooms"
                    error={showError ? (formik.errors.bedrooms as string) : ""}
                  />
                  <NumberField
                    formik={formik}
                    name="bathrooms"
                    label="Bathrooms"
                    error={showError ? (formik.errors.bathrooms as string) : ""}
                  />
                  <NumberField
                    formik={formik}
                    name="parking"
                    label="Parking places"
                    error={showError ? (formik.errors.parking as string) : ""}
                  />
                </div>
              </SectionRow>
            )}

            <SectionRow
              icon={<Squares2X2Icon className="h-5 w-5" />}
              title="Dimensions"
              description={
                isLand
                  ? "Land listings only need the total plot area."
                  : "Use total area for the headline and add supporting spaces where relevant."
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  formik={formik}
                  name="totalArea"
                  label={isLand ? "Plot area" : "Total area"}
                  unit="m²"
                  error={showError ? (formik.errors.totalArea as string) : ""}
                />
                {!isLand && (
                  <>
                    <NumberField
                      formik={formik}
                      name="livingArea"
                      label="Living area"
                      unit="m²"
                      error={
                        showError ? (formik.errors.livingArea as string) : ""
                      }
                    />
                    <NumberField
                      formik={formik}
                      name="areaOutside"
                      label="Outside area"
                      unit="m²"
                      error={
                        showError ? (formik.errors.areaOutside as string) : ""
                      }
                    />
                    <NumberField
                      formik={formik}
                      name="areaGarage"
                      label="Garage area"
                      unit="m²"
                      error={
                        showError ? (formik.errors.areaGarage as string) : ""
                      }
                    />
                    <NumberField
                      formik={formik}
                      name="volume"
                      label="Volume"
                      unit="m³"
                      error={showError ? (formik.errors.volume as string) : ""}
                    />
                  </>
                )}
              </div>
            </SectionRow>

            {!isLand && (
              <>
                <SectionRow
                  icon={<RectangleGroupIcon className="h-5 w-5" />}
                  title="Interior and condition"
                  description="These fields make the listing easier to understand before a viewing."
                >
                  <div className="grid gap-6">
                    <div>
                      <p className="mb-3 text-sm font-bold text-[#1F2937]">
                        Interior type
                      </p>
                      <SingleSelectRadioButton
                        value={formik.values.interiorType}
                        options={INTERIOR_TYPES}
                        onChange={(value) =>
                          formik.setFieldValue("interiorType", value, true)
                        }
                        id="interiorType"
                      />
                      <ErrorText>
                        {showError
                          ? (formik.errors.interiorType as string)
                          : ""}
                      </ErrorText>
                    </div>
                    <div>
                      <p className="mb-3 text-sm font-bold text-[#1F2937]">
                        Property condition
                      </p>
                      <SingleSelectRadioButton
                        value={formik.values.upkeepType}
                        options={UPKEEP_TYPES}
                        onChange={(value) =>
                          formik.setFieldValue("upkeepType", value, true)
                        }
                        id="upkeepType"
                      />
                      <ErrorText>
                        {showError ? (formik.errors.upkeepType as string) : ""}
                      </ErrorText>
                    </div>
                  </div>
                </SectionRow>

                <SectionRow
                  icon={<FireIcon className="h-5 w-5" />}
                  title="Heating"
                  description="Select the primary heating type used by the property."
                >
                  <SingleSelectRadioButton
                    value={formik.values.heatingType}
                    options={HEATING_TYPES}
                    onChange={(value) =>
                      formik.setFieldValue("heatingType", value, true)
                    }
                    id="heatingType"
                  />
                  <ErrorText>
                    {showError ? (formik.errors.heatingType as string) : ""}
                  </ErrorText>
                </SectionRow>

                <SectionRow
                  icon={<BuildingOffice2Icon className="h-5 w-5" />}
                  title="Building details"
                  description="Optional details that help buyers understand the building and floor position."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <NumberField
                      formik={formik}
                      name="constructedYear"
                      label="Year built"
                      min={1900}
                      max={tenYearsFromNow}
                      error={
                        showError
                          ? (formik.errors.constructedYear as string)
                          : ""
                      }
                    />
                    <NumberField
                      formik={formik}
                      name="numberOfFloorsCommon"
                      label="Floors in building"
                      error={
                        showError
                          ? (formik.errors.numberOfFloorsCommon as string)
                          : ""
                      }
                    />
                    <NumberField
                      formik={formik}
                      name="floorNumber"
                      label="Property floor"
                      error={
                        showError ? (formik.errors.floorNumber as string) : ""
                      }
                    />
                  </div>
                </SectionRow>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#334155] transition hover:border-[#1F5FD6] hover:text-[#1F5FD6] sm:w-auto"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#1F5FD6] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] sm:w-auto"
            >
              Continue to photos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreDetails;
