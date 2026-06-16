import PropertyPlacementRadioButtons from "@/app/components/propertyPlacementEdit/PropertyPlacementRadioButtons";
import {
  CURRENCIES,
  HEATING_TYPES,
  INTERIOR_TYPES,
  LISTING_TYPES,
  PROPERTY_TYPES,
  UPKEEP_TYPES,
} from "@/app/lib/constants";
import SingleSelectRadioButton from "@/app/components/propertyPlacementEdit/SingleSelectRadioButton";
import { PlacingPropertyImagesHandler } from "@/app/components/propertyPlacementEdit/PlacingPropertyImagesHandler";
import React from "react";
import { FormikProps } from "formik";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CreatePropertyComponentPropInterface {
  formik: FormikProps<any>;
}

const inputClass =
  "h-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#2D3648] outline-none transition focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

const numberInputClass =
  "h-10 w-min rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#2D3648] outline-none transition focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

const selectClass =
  "h-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#2D3648] outline-none transition focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

const EditableConfirmationPage = ({
  formik,
}: CreatePropertyComponentPropInterface) => {
  return (
    <>
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box">
        <div className="flex justify-between">
          <p className="mb-2 text-lg font-bold">Renting or Selling</p>
        </div>
        <div className="max-w-lg">
          <PropertyPlacementRadioButtons
            value={formik.values.listingType}
            options={LISTING_TYPES}
            onChange={(e) => formik.setFieldValue("listingType", e, true)}
            id="listingType"
          />
        </div>
      </div>
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="mb-2 text-lg font-bold">Property type</p>
        </div>
        <div className="max-w-lg">
          <select
            value={formik.values.propertyType}
            id="propertyType"
            onChange={(e) =>
              formik.setFieldValue("propertyType", e.target.value, true)
            }
            onBlur={formik.handleBlur}
            className={selectClass}
          >
            {PROPERTY_TYPES.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box">
        <div className="flex justify-between">
          <p className="mb-2 text-lg font-bold">Address</p>
        </div>
        <p className="mb-2 mt-4 text-sm font-bold">House Number</p>
        <input
          type="text"
          id="streetNumber"
          name="streetNumber"
          value={formik.values.streetNumber}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mb-2 mt-4 text-sm font-bold">Street</p>
        <input
          type="text"
          id="route"
          name="route"
          value={formik.values.route}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mb-2 mt-4 text-sm font-bold">City</p>
        <input
          type="text"
          id="locality"
          name="locality"
          value={formik.values.locality}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mb-2 mt-4 text-sm font-bold">Administrative area</p>
        <input
          type="text"
          id="administrativeArea"
          name="administrativeArea"
          value={formik.values.administrativeArea}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mb-2 mt-4 text-sm font-bold">Postal Code</p>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mb-2 mt-4 text-sm font-bold">Latitude</p>
        <input
          type="text"
          id="latitude"
          name="latitude"
          value={formik.values.latitude}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mb-2 mt-4 text-sm font-bold">Longitude</p>
        <input
          type="text"
          id="longitude"
          name="longitude"
          value={formik.values.longitude}
          onChange={formik.handleChange}
          className={inputClass}
        />
      </div>
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="mb-2 text-lg font-bold">Asking Price</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="mb-2 text-sm font-bold">Select the currency</p>
          <select
            id="currency"
            onChange={(e) =>
              formik.setFieldValue("currency", e.target.value, true)
            }
            value={formik.values.currency}
            className={selectClass}
          >
            {CURRENCIES.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <p className="mb-2 text-sm font-bold">Type your price</p>
          <input
            type="number"
            className={numberInputClass}
            placeholder="0"
            name="price"
            min={0}
            id="price"
            onChange={(e) =>
              formik.setFieldValue(
                "price",
                e.target.value === "" ? undefined : Number(e.target.value),
                true,
              )
            }
            value={formik.values.price ?? ""}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>
      <hr className="my-6 border-slate-200" />
      {formik.values.propertyType !== "LAND" && (
        <div className="detail_single_box flex flex-col gap-4">
          <div>
            <p className="mb-2 text-lg font-bold">
              General information about the property
            </p>
          </div>
          {(
            [
              ["rooms", "Rooms"],
              ["bedrooms", "Bedrooms"],
              ["bathrooms", "Bathrooms"],
              ["parking", "Parking places"],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="flex flex-col gap-1">
              <span className="mb-2 text-sm font-bold">{label}</span>
              <input
                type="number"
                className={numberInputClass}
                name={field}
                id={field}
                min={0}
                onChange={(e) =>
                  formik.setFieldValue(
                    field,
                    e.target.value === "" ? undefined : Number(e.target.value),
                    true,
                  )
                }
                onBlur={formik.handleBlur}
                value={formik.values[field] ?? ""}
              />
            </div>
          ))}
        </div>
      )}
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="mb-2 text-lg font-bold">Property dimensions</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="mb-2 text-sm font-bold">Total area</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="0"
              className={numberInputClass}
              min={0}
              name="totalArea"
              id="totalArea"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.totalArea ?? ""}
            />
            m²
          </div>
        </div>
        {formik.values.propertyType !== "LAND" && (
          <>
            {(
              [
                ["livingArea", "Living area"],
                ["areaOutside", "Outside area"],
                ["areaGarage", "Garage"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="flex flex-col gap-1">
                <span className="mb-2 text-sm font-bold">{label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    className={numberInputClass}
                    min={0}
                    name={field}
                    id={field}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field] ?? ""}
                  />
                  m²
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <span className="mb-2 text-sm font-bold">Volume</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="0"
                  className={numberInputClass}
                  min={0}
                  name="volume"
                  id="volume"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.volume ?? ""}
                />
                m³
              </div>
            </div>
          </>
        )}
      </div>
      <hr className="my-6 border-slate-200" />
      {formik.values.propertyType !== "LAND" && (
        <>
          <div className="detail_single_box flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="mb-2 text-lg font-bold">Interior type</p>
            </div>
            <div className="max-w-lg">
              <SingleSelectRadioButton
                onBlur={formik.handleBlur}
                value={formik.values.interiorType}
                options={INTERIOR_TYPES}
                onChange={(e) => formik.setFieldValue("interiorType", e, true)}
                id="interiorType"
              />
            </div>
          </div>
          <hr className="my-6 border-slate-200" />
          <div className="detail_single_box flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="mb-2 text-lg font-bold">Property condition</p>
            </div>
            <div className="max-w-lg">
              <SingleSelectRadioButton
                value={formik.values.upkeepType}
                options={UPKEEP_TYPES}
                onChange={(e) => formik.setFieldValue("upkeepType", e, true)}
                id="upkeepType"
              />
            </div>
          </div>
          <hr className="my-6 border-slate-200" />
          <div className="detail_single_box flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="mb-2 text-lg font-bold">Heating type</p>
            </div>
            <div className="max-w-lg">
              <SingleSelectRadioButton
                value={formik.values.heatingType}
                options={HEATING_TYPES}
                onChange={(e) => formik.setFieldValue("heatingType", e, true)}
                id="heatingType"
              />
            </div>
          </div>
          <hr className="my-6 border-slate-200" />
          <div className="detail_single_box flex flex-col gap-4">
            <div>
              <p className="mb-2 text-lg font-bold">Building specifications</p>
            </div>
            {(
              [
                ["constructedYear", "Year of built", 2010, 2040],
                [
                  "numberOfFloorsCommon",
                  "Floors in the building",
                  0,
                  undefined,
                ],
                [
                  "floorNumber",
                  "Apartment located at floor number",
                  0,
                  undefined,
                ],
              ] as const
            ).map(([field, label, min, max]) => (
              <div key={field} className="flex flex-col gap-1">
                <span className="mb-2 text-sm font-bold">{label}</span>
                <input
                  type="number"
                  className={numberInputClass}
                  min={min}
                  max={max}
                  onBlur={formik.handleBlur}
                  name={field}
                  id={field}
                  onChange={(e) =>
                    formik.setFieldValue(
                      field,
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                      true,
                    )
                  }
                  value={formik.values[field] ?? ""}
                />
              </div>
            ))}
          </div>
          <hr className="my-6 border-slate-200" />
        </>
      )}
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box">
        <div className="flex justify-between">
          <p className="mb-2 text-[18px] font-bold">Images</p>
        </div>
        <div className="max-w-[500px]">
          <PlacingPropertyImagesHandler
            initialImages={formik.values.images || []}
            onChange={(images) => formik.setFieldValue("images", images, true)}
          />
        </div>
      </div>
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box flex flex-col gap-6">
        <p className="mb-2 text-lg font-bold">Property description</p>
        <div className="flex flex-col gap-4">
          <span className="text-lg font-bold">Description</span>
          <textarea
            name="description"
            id="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            placeholder="Type your description here"
            className="text-md h-48 max-h-64 min-h-fit max-w-lg rounded-md border-2 border-[#97B6FF] p-3 text-gray-500 outline-0"
          />
        </div>
        <hr className="my-6 border-slate-200" />
        <div></div>
      </div>
    </>
  );
};

export default EditableConfirmationPage;
