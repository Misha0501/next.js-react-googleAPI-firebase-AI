import PropertyPlacementRadioButtons from "./PropertyPlacementRadioButtons";
import {
  CURRENCIES,
  HEATING_TYPES,
  INTERIOR_TYPES,
  LISTING_TYPES,
  PROPERTY_TYPES,
  UPKEEP_TYPES,
} from "../../lib/constants";
import SingleSelectRadioButton from "./SingleSelectRadioButton";
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

function EditableConfirmationPage({
  formik,
}: CreatePropertyComponentPropInterface) {
  return (
    <>
      <hr className="my-6 border-slate-200" />
      <div className="detail_single_box">
        <div className="flex justify-between">
          <p className="font-bold text-lg mb-2">Renting or Selling</p>
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
      <div className="detail_single_box flex gap-2 flex-col">
        <div className="flex justify-between">
          <p className="font-bold text-lg mb-2">Property type</p>
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
          <p className="font-bold text-lg mb-2">Address</p>
        </div>
        <p className="font-bold text-sm mt-4 mb-2">House Number</p>
        <input
          type="text"
          id="streetNumber"
          name="streetNumber"
          value={formik.values.streetNumber}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Street</p>
        <input
          type="text"
          id="route"
          name="route"
          value={formik.values.route}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mt-4 mb-2 font-bold text-sm">City</p>
        <input
          type="text"
          id="locality"
          name="locality"
          value={formik.values.locality}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Administrative area</p>
        <input
          type="text"
          id="administrativeArea"
          name="administrativeArea"
          value={formik.values.administrativeArea}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Postal Code</p>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Latitude</p>
        <input
          type="text"
          id="latitude"
          name="latitude"
          value={formik.values.latitude}
          onChange={formik.handleChange}
          className={inputClass}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Longitude</p>
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
      <div className="detail_single_box flex gap-4 flex-col">
        <div className="flex justify-between">
          <p className="font-bold text-lg mb-2">Asking Price</p>
        </div>
        <div className="flex gap-2 flex-col">
          <p className="mb-2 font-bold text-sm">Select the currency</p>
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
        <div className="flex gap-2 flex-col">
          <p className="mb-2 font-bold text-sm">Type your price</p>
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
        <div className="detail_single_box flex gap-4 flex-col">
          <div>
            <p className="font-bold text-lg mb-2">
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
            <div key={field} className="flex gap-1 flex-col">
              <span className="mb-2 font-bold text-sm">{label}</span>
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
      <div className="detail_single_box flex gap-4 flex-col">
        <div className="flex justify-between">
          <p className="font-bold text-lg mb-2">Property dimensions</p>
        </div>
        <div className="flex gap-1 flex-col">
          <span className="mb-2 font-bold text-sm">Total area</span>
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
              <div key={field} className="flex gap-1 flex-col">
                <span className="mb-2 font-bold text-sm">{label}</span>
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
            <div className="flex gap-1 flex-col">
              <span className="mb-2 font-bold text-sm">Volume</span>
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
          <div className="detail_single_box flex gap-2 flex-col">
            <div className="flex justify-between">
              <p className="font-bold text-lg mb-2">Interior type</p>
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
          <div className="detail_single_box flex gap-2 flex-col">
            <div className="flex justify-between">
              <p className="font-bold text-lg mb-2">Property condition</p>
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
          <div className="detail_single_box flex gap-2 flex-col">
            <div className="flex justify-between">
              <p className="font-bold text-lg mb-2">Heating type</p>
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
              <p className="font-bold text-lg mb-2">Building specifications</p>
            </div>
            {(
              [
                ["constructedYear", "Year of built", 2010, 2040],
                ["numberOfFloorsCommon", "Floors in the building", 0, undefined],
                ["floorNumber", "Apartment located at floor number", 0, undefined],
              ] as const
            ).map(([field, label, min, max]) => (
              <div key={field} className="flex flex-col gap-1">
                <span className="mb-2 font-bold text-sm">{label}</span>
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
          <p className="font-bold text-[18px] mb-2">Images</p>
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
        <p className="font-bold text-lg mb-2">Property description</p>
        <div className="flex flex-col gap-4">
          <span className="font-bold text-lg">Description</span>
          <textarea
            name="description"
            id="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            placeholder="Type your description here"
            className="border-2 border-[#97B6FF] rounded-md max-w-lg outline-0 h-48 max-h-64 min-h-fit p-3 text-gray-500 text-md"
          />
        </div>
        <hr className="my-6 border-slate-200" />
        <div></div>
      </div>
    </>
  );
}

export default EditableConfirmationPage;
