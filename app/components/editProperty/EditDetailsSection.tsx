import {
  BuildingOffice2Icon,
  FireIcon,
  HomeModernIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { FormikProps } from "formik";
import {
  HEATING_TYPES,
  INTERIOR_TYPES,
  UPKEEP_TYPES,
} from "../../lib/constants";
import SingleSelectRadioButton from "../propertyPlacementEdit/SingleSelectRadioButton";
import { EditPropertyValues } from "./types";
import { ErrorText, NumberField, SectionRow } from "./editFormPrimitives";

type Props = {
  formik: FormikProps<EditPropertyValues>;
  showError: boolean;
};

export const EditDetailsSection = ({ formik, showError }: Props) => {
  const isLand = formik.values.propertyType === "LAND";
  const tenYearsFromNow = new Date().getFullYear() + 10;

  return (
    <>
      {!isLand && (
        <SectionRow
          icon={<HomeModernIcon className="h-5 w-5" />}
          title="Rooms and parking"
          description="Keep the headline numbers accurate for search and comparison."
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
            ? "Land properties only need the total plot area."
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
                error={showError ? (formik.errors.livingArea as string) : ""}
              />
              <NumberField
                formik={formik}
                name="areaOutside"
                label="Outside area"
                unit="m²"
                error={showError ? (formik.errors.areaOutside as string) : ""}
              />
              <NumberField
                formik={formik}
                name="areaGarage"
                label="Garage area"
                unit="m²"
                error={showError ? (formik.errors.areaGarage as string) : ""}
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
            icon={<FireIcon className="h-5 w-5" />}
            title="Interior and condition"
            description="Update comfort and condition details that buyers scan quickly."
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
                  {showError ? (formik.errors.interiorType as string) : ""}
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
            description="Optional details that explain the building and floor position."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                formik={formik}
                name="constructedYear"
                label="Year built"
                min={1900}
                max={tenYearsFromNow}
                error={
                  showError ? (formik.errors.constructedYear as string) : ""
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
                error={showError ? (formik.errors.floorNumber as string) : ""}
              />
            </div>
          </SectionRow>
        </>
      )}
    </>
  );
};
