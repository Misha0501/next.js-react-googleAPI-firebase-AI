import {
  Divider,
  //   Icon,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
} from "@tremor/react";
import Image from "next/image";
import PropertyPlacementRadioButtons from "../PropertyPlacementRadioButtons";
import {
  BUILDING_TYPE,
  CHARACTERISTICS,
  CURRENCIES,
  HEATING_TYPES,
  INTERIOR_TYPES,
  LISTING_TYPES,
  PROPERTY_TYPES,
  UPKEEP_TYPES,
} from "@/app/Constants";
import MultiSelectRadioButton from "../MultiSelectRadioButton";
import SingleSelectRadioButton from "../SingleSelectRadioButton";
import { PlacingPropertyImagesHandler } from "@/app/components/PlacingPropertyImagesHandler";
import React from "react";

function EditableConfirmationPage({ formik }: any) {
  return (
    <>
      <Divider />
      <div className="detail_single_box">
        <div className="flex justify-between">
          <p className={"font-bold text-lg mb-2"}>Renting or Selling</p>
          {/* <Icon icon={PencilSquareIcon} /> */}
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
      <Divider />
      <div className="detail_single_box flex gap-2 flex-col">
        <div className="flex justify-between">
          <p className={"font-bold text-lg mb-2"}>Property type</p>
          {/* <Icon icon={PencilSquareIcon} /> */}
        </div>
        <div className="max-w-lg">
          <Select
            // defaultValue={formik.values.propertyType}
            value={formik.values.propertyType}
            id="propertyType"
            onChange={(e) => formik.setFieldValue("propertyType", e, true)}
            onBlur={formik.handleBlur}
          >
            {PROPERTY_TYPES.map((item, index) => (
              <SelectItem value={item} key={index}>
                {item}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <Divider />
      <div className="detail_single_box">
        <div className="flex justify-between">
          <p className={"font-bold text-lg mb-2"}>Address</p>
          {/* <Icon icon={PencilSquareIcon} /> */}
        </div>
        {/* <span className="font-bold text-sm mb-2">Address line</span>
        <TextInput
          className="bg-transparent border-0 shadow-none max-w-lg"
          id="streetNumber"
          name="streetNumber"
          value={formik.values.streetNumber}
          onChange={(e) => formik.setFieldValue("streetNumber", e, true)}
        /> */}
        <p className="font-bold text-sm mt-4 mb-2 ">House Number</p>
        <TextInput
          className="bg-transparent  shadow-none max-w-lg"
          id="streetNumber"
          name="streetNumber"
          value={formik.values.streetNumber}
          onChange={formik.handleChange}
        />
        <p className="mt-4 mb-2  font-bold text-sm">Street</p>
        <TextInput
          className="bg-transparent  shadow-none max-w-lg"
          id="route"
          name="route"
          value={formik.values.route}
          onChange={formik.handleChange}
        />
        <p className="mt-4 mb-2 font-bold text-sm">City</p>
        <TextInput
          className="bg-transparent  shadow-none max-w-lg"
          id="locality"
          name="locality"
          value={formik.values.locality}
          onChange={formik.handleChange}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Administrative area</p>
        <TextInput
          className="bg-transparent  shadow-none max-w-lg"
          id="administrativeArea"
          name="administrativeArea"
          value={formik.values.administrativeArea}
          onChange={formik.handleChange}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Postal Code</p>
        <TextInput
          className="bg-transparent  shadow-none max-w-lg"
          id="postalCode"
          name="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Latitude</p>
        <TextInput
          className="bg-transparent  shadow-none max-w-lg"
          id="latitude"
          name="latitude"
          value={formik.values.latitude}
          onChange={formik.handleChange}
        />
        <p className="mt-4 mb-2 font-bold text-sm">Longitude</p>
        <TextInput
          className="bg-transparent  shadow-none max-w-lg"
          id="longitude"
          name="longitude"
          value={formik.values.longitude}
          onChange={formik.handleChange}
        />
      </div>
      <Divider />
      <div className="detail_single_box flex gap-4 flex-col">
        <div className="flex justify-between">
          <p className={"font-bold text-lg mb-2"}>Asking Price</p>
        </div>
        <div className="flex gap-2 flex-col">
          <p className={"mb-2 font-bold text-sm"}>Select the currency</p>
          <div className="max-w-sm">
            <Select
              id="currency"
              onChange={(e) => formik.setFieldValue("currency", e, true)}
              className={"text-sm"}
              value={formik.values.currency}
            >
              {CURRENCIES.map((item, index) => (
                <SelectItem value={item} key={index}>
                  {item}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-2 flex-col">
          <p className={"mb-2 font-bold text-sm"}>Type your price</p>
          <NumberInput
            className="max-w-sm"
            name="price"
            min={0}
            id="price"
            onValueChange={(e) => formik.setFieldValue("price", e, true)}
            value={formik.values.price}
            onBlur={formik.handleBlur}
            error={!!formik.errors.price && !!formik.touched.price}
          />
        </div>
      </div>
      <Divider />
      {formik.values.propertyType !== "LAND" &&
        <div className="detail_single_box flex gap-4 flex-col">
          <div>
            <p className={"font-bold text-lg mb-2"}>
              General information about the property
            </p>
          </div>
          <div className="flex gap-1 flex-col">
            <span className="mb-2 font-bold text-sm">Rooms</span>
            <NumberInput
              className={"w-min"}
              name="rooms"
              id="rooms"
              min={0}
              onValueChange={(e) => formik.setFieldValue("rooms", e, true)}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.rooms && formik.errors.rooms)}
              value={formik.values.rooms}
            />
          </div>
          <div className="flex gap-1 flex-col">
            <span className="mb-2 font-bold text-sm">Bedrooms</span>
            <NumberInput
              className={"w-min"}
              name="bedrooms"
              min={0}
              id="bedrooms"
              onValueChange={(e) => formik.setFieldValue("bedrooms", e, true)}
              error={Boolean(formik.touched.bedrooms && formik.errors.bedrooms)}
              value={formik.values.bedrooms}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="flex gap-1 flex-col">
            <span className="mb-2 font-bold text-sm">Bathrooms</span>
            <NumberInput
              className={"w-min"}
              name="bathrooms"
              min={0}
              id="bathrooms"
              onValueChange={(e) => formik.setFieldValue("bathrooms", e, true)}
              error={Boolean(formik.touched.bathrooms && formik.errors.bathrooms)}
              value={formik.values.bathrooms}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>}
      <Divider />
      {/*<div className="detail_single_box flex gap-2 flex-col">*/}
      {/*  <div className="flex justify-between">*/}
      {/*    <p className={"font-bold text-lg mb-2"}>Property characteristics</p>*/}
      {/*    /!* <Icon icon={PencilSquareIcon} /> *!/*/}
      {/*  </div>*/}
      {/*  <div className="max-w-3xl">*/}
      {/*    <MultiSelectRadioButton*/}
      {/*      value={formik.values.characteristics}*/}
      {/*      options={CHARACTERISTICS}*/}
      {/*      onChange={(e) => formik.setFieldValue("characteristics", e, true)}*/}
      {/*      id="characteristics"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<Divider />*/}
      {/* <Icon icon={PencilSquareIcon} /> */}
      <div className="detail_single_box flex gap-4 flex-col">
        <div className="flex justify-between">
          <p className={"font-bold text-lg mb-2"}>Property dimentions</p>
        </div>
        <div className="flex gap-1 flex-col">
          <span className="mb-2 font-bold text-sm">Total area</span>
          <div className="flex items-center gap-2">
            <NumberInput
              placeholder="0"
              enableStepper={false}
              className={"w-min border-[#97B6FF]"}
              min={0}
              name="totalarea"
              id="totalarea"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!formik.touched.totalarea && !!formik.errors.totalarea}
              value={formik.values.totalarea}
            />
            m2
          </div>
        </div>
        {/* <TextInput
          className={"w-min border-[#97B6FF]"}
          name="totalarea"
          id="totalarea"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.totalarea && formik.errors.totalarea)}
          value={formik.values.totalarea}
        /> */}
        {formik.values.propertyType !== "LAND" &&
          <>
            <div className="flex gap-1 flex-col">
              <span className="mb-2 font-bold text-sm">Living area</span>
              <div className="flex items-center gap-2">
                <NumberInput
                  placeholder="0"
                  enableStepper={false}
                  className={"w-min border-[#97B6FF]"}
                  min={0}
                  name="livingarea"
                  id="livingarea"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.livingarea && !!formik.errors.livingarea}
                  value={formik.values.livingarea}
                />
                m2
              </div>
            </div>
            {/* <TextInput
          className={"w-min border-[#97B6FF]"}
          name="livingarea"
          id="livingarea"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.livingarea && formik.errors.livingarea)}
          value={formik.values.livingarea}
        /> */}
            <div className="flex gap-1 flex-col">
              <span className="mb-2 font-bold text-sm">Outside area</span>
              <div className="flex items-center gap-2">
                <NumberInput
                  enableStepper={false}
                  placeholder="0"
                  className={"w-min border-[#97B6FF]"}
                  name="outsidearea"
                  id="outsidearea"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    !!formik.touched.outsidearea && !!formik.errors.outsidearea
                  }
                  value={formik.values.outsidearea}
                />
                m2
              </div>
            </div>
            {/* <TextInput
          className={"w-min border-[#97B6FF]"}
          name="outsidearea"
          id="outsidearea"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(
            formik.touched.outsidearea && formik.errors.outsidearea
          )}
          value={formik.values.outsidearea}
        /> */}
            <div className="flex gap-1 flex-col">
              <span className="mb-2 font-bold text-sm">Garden</span>
              <div className="flex items-center gap-2">
                <NumberInput
                  enableStepper={false}
                  placeholder="0"
                  className={"w-min border-[#97B6FF]"}
                  name="garden"
                  id="garden"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.garden && !!formik.errors.garden}
                  value={formik.values.garden}
                />
                m2
              </div>
            </div>
            {/* <TextInput
          className={"w-min border-[#97B6FF]"}
          name="garden"
          id="garden"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.garden && formik.errors.garden)}
          value={formik.values.garden}
        /> */}
            <div className="flex gap-1 flex-col">
              <span className="mb-2 font-bold text-sm">Garage</span>
              <div className="flex items-center gap-2">
                <NumberInput
                  enableStepper={false}
                  placeholder="0"
                  className={"w-min border-[#97B6FF]"}
                  name="garage"
                  id="garage"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.garage && !!formik.errors.garage}
                  value={formik.values.garage}
                />
                m2
              </div>
            </div>
            {/* <TextInput
          className={"w-min border-[#97B6FF]"}
          name="garage"
          id="garage"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.garage && formik.errors.garage)}
          value={formik.values.garage}
        /> */}
            <div className="flex gap-1 flex-col">
              <span className="mb-2 font-bold text-sm">Volume</span>
              <div className="flex items-center gap-2">
                <NumberInput
                  enableStepper={false}
                  placeholder="0"
                  className={"w-min border-[#97B6FF]"}
                  name="volume"
                  id="volume"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.volume && !!formik.errors.volume}
                  value={formik.values.volume}
                />
                m3
              </div>
            </div>
          </>
        }
        {/* <TextInput
          className={"w-min border-[#97B6FF]"}
          name="volume"
          id="volume"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.touched.volume && formik.errors.volume)}
          value={formik.values.volume}
        /> */}
      </div>
      <Divider />
      {formik.values.propertyType !== "LAND" &&
        <>
          <div className="detail_single_box flex gap-2 flex-col">
            <div className="flex justify-between">
              <p className={"font-bold text-lg mb-2"}>Interior type</p>
              {/* <Icon icon={PencilSquareIcon} /> */}
            </div>
            <div className="max-w-lg">
              <SingleSelectRadioButton
                onBlur={formik.onBlur}
                value={formik.values.interiortype}
                options={INTERIOR_TYPES}
                onChange={(e) => formik.setFieldValue("interiortype", e, true)}
                id="interiortype"
              />
              {formik.errors.interiortype ? <p>error</p> : null}
            </div>
          </div>
          <Divider />
          <div className="detail_single_box flex gap-2 flex-col">
            <div className="flex justify-between">
              <p className={"font-bold text-lg mb-2"}>Property condition</p>
              {/* <Icon icon={PencilSquareIcon} /> */}
            </div>
            <div className="max-w-lg">
              <SingleSelectRadioButton
                value={formik.values.upkeeptype}
                options={UPKEEP_TYPES}
                onChange={(e) => formik.setFieldValue("upkeeptype", e, true)}
                id="upkeeptype"
              />
            </div>
          </div>
          <Divider />
          <div className="detail_single_box flex gap-2 flex-col">
            <div className="flex justify-between">
              <p className={"font-bold text-lg mb-2"}>Heating type</p>
              {/* <Icon icon={PencilSquareIcon} /> */}
            </div>
            <div className="max-w-lg">
              <SingleSelectRadioButton
                value={formik.values.heatingtype}
                options={HEATING_TYPES}
                onChange={(e) => formik.setFieldValue("heatingtype", e, true)}
                id="heatingtype"
              />
            </div>
          </div>
          <Divider />
          <div className="detail_single_box flex flex-col gap-4">
            <div>
              <p className={"font-bold text-lg mb-2"}>Building specifications</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="mb-2 font-bold text-sm">Year of built</span>
              <NumberInput
                className={"w-min border-[#97B6FF]"}
                min={2010}
                max={2040}
                onBlur={formik.handleBlur}
                name="yearBuilt"
                id="yearBuilt"
                onValueChange={(e) => formik.setFieldValue("yearBuilt", e, true)}
                error={Boolean(formik.touched.yearBuilt && formik.errors.yearBuilt)}
                value={formik.values.yearBuilt}
              />
            </div>
            <div className="flex flex-col gap-1">
          <span className="mb-2  font-bold text-sm">
            Floors in the building
          </span>
              <NumberInput
                className={"w-min border-[#97B6FF]"}
                name="numberOfFloorsCommon"
                id="numberOfFloorsCommon"
                onBlur={formik.handleBlur}
                onValueChange={(e) =>
                  formik.setFieldValue("numberOfFloorsCommon", e, true)
                }
                error={Boolean(
                  formik.touched.numberOfFloorsCommon &&
                  formik.errors.numberOfFloorsCommon
                )}
                value={formik.values.numberOfFloorsCommon}
              />
            </div>
            <div className="flex flex-col gap-1">
          <span className="mb-2 font-bold text-sm">
            Apartment located at floor number
          </span>
              <NumberInput
                className={"w-min border-[#97B6FF]"}
                name="floorNumber"
                id="floorNumber"
                onValueChange={(e) => formik.setFieldValue("floorNumber", e, true)}
                onBlur={formik.handleBlur}
                error={Boolean(
                  formik.touched.floorNumber && formik.errors.floorNumber
                )}
                value={formik.values.floorNumber}
              />
            </div>
          </div>
          <Divider />
          {/*<div className="flex flex-col gap-2">*/}
          {/*  <span className="mb-2 font-bold text-lg">Building type</span>*/}
          {/*  <div className="max-w-sm">*/}
          {/*    <Select*/}
          {/*      onBlur={formik.handleBlur}*/}
          {/*      value={formik.values.buildingtype}*/}
          {/*      id="buildingtype"*/}
          {/*      onChange={(e) => formik.setFieldValue("buildingtype", e, true)}*/}
          {/*      className={"text-sm"}*/}
          {/*    >*/}
          {/*      {BUILDING_TYPE.map((item, index) => (*/}
          {/*        <SelectItem value={item} key={index}>*/}
          {/*          {item}*/}
          {/*        </SelectItem>*/}
          {/*      ))}*/}
          {/*    </Select>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </>
      }
      <Divider />
      <div className="detail_single_box">
        <div className="flex justify-between">
          <p className={"font-bold text-[18px]  mb-2"}>Images</p>
        </div>
        <div className={"max-w-[500px]"}>
          <PlacingPropertyImagesHandler
            initialImages={formik.values.images || []}
            onChange={(images) => formik.setFieldValue("images", images, true)}
          />
        </div>
      </div>
      <Divider />
      <div className="detail_single_box flex flex-col gap-6">
        <p className={"font-bold text-lg mb-2"}>Property description</p>
        {/* <Icon icon={PencilSquareIcon} /> */}

        <div className=" flex flex-col gap-4">
          <span className="font-bold text-lg">Description</span>

          <textarea
            //   error={Boolean(
            //     formik.touched.discription && formik.errors.discription
            //   )}
            maxLength={1000}
            name="discription"
            id="discription"
            onChange={formik.handleChange}
            value={formik.values.discription}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sapien ornare vitae amet."
            className={
              "border-2 border-[#97B6FF] rounded-md max-w-lg  outline-0 h-48 max-h-64 min-h-fit  p-3 text-gray-500 text-md"
            }
          />
        </div>
        <Divider />
        <div></div>
      </div>
    </>
  );
}

export default EditableConfirmationPage;
