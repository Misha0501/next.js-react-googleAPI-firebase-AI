import { Button, Divider, Icon } from "@tremor/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import NextToConfirmationPage from "./NextToConfirmationPage";
import EditableConfirmationPage from "./EditableConfirmationPage";
import { useCreateProperty } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";

function Confirmation({ formik, handleBack, step }: any) {
  const { authToken } = useAuthContext();
  const title = "Confirm your advertisment";
  const stepNumber = "Step 4";
  const [openAdvertisementSection, setOpenAdvertisementSection] =
    useState(false);
  const [disableState, setDisableState] = useState(true);
  const createProperty = useCreateProperty({ authToken: authToken });
  function confirmBtnHandler() {
    // formik.handleSubmit;
    createProperty.mutate({
      listingType: formik?.values?.listingType,
      propertyType: formik?.values?.propertyType,
      currency: formik?.values?.currency,
      price: formik?.values?.price,
      rooms: formik?.values?.rooms,
      bedrooms: formik?.values?.bedrooms,
      bathrooms: formik?.values?.bathrooms,
      areaTotal: formik?.values?.totalarea,
      areaLiving: formik?.values?.livingarea,
      outsideArea: formik.valus?.outsidearea,
      garden: formik?.values?.garden,
      garage: formik?.values?.garage,
      volume: formik?.values?.volume,
      interiorType: formik?.values?.interiortype,
      upkeepType: formik?.values?.upkeeptype,
      heatingType: formik?.values?.heatingtype,
      yearBuilt: formik?.values?.yearBuilt,
      numberOfFloorsCommon: formik?.values?.numberOfFloorsCommon,
      floorNumber: formik?.values?.floorNumber,
      buildingtype: formik?.values?.buildingtype,
      characteristics: formik?.values?.characteristics,
      description: formik?.values?.discription,
      address: {
        streetNumber: formik.values.street,
        administrativeAreaLevelOne: formik.values.administrativeArea,
        locality: formik.values.housenumber,
        postalCode: formik.values.postalCode,
        latitude: formik.values.latitude,
        longitude: formik.values.longitude,
      },
      images: formik.values.images,
    });
  }

  useEffect(() => {
    if (createProperty.isSuccess) {
      setOpenAdvertisementSection(true);
    }
  }, [createProperty.isSuccess]);

  const handleButtonClick = (event: any) => {
    event.preventDefault();
    setDisableState(!disableState);
  };

  return (
    <>
      {openAdvertisementSection ? (
        <NextToConfirmationPage />
      ) : (
        <div className="max-w-screen-xl m-auto">
          <div className="flex items-center justify-center">
            <div className="py-10 w-full gap-20 align-middle">
              <div>
                <p className="text-[18px] text-[#222]">{stepNumber}</p>
                <h4
                  className="text-[40px] font-bold py-10"
                  style={{ lineHeight: "120%" }}
                >
                  {title}
                </h4>
              </div>
            </div>
            {disableState ? (
              <Button
                type="button"
                onClick={handleButtonClick}
                className={
                  " text-lg  w-[258px] bg-[#4785FD] text-white font-bold py-4 px-6  rounded-lg"
                }
              >
                Edit
                <Icon
                  className="text-white  pl-4 font-bold align-middle "
                  icon={PencilSquareIcon}
                />
              </Button>
            ) : (
              <Button
                onClick={() => setDisableState(true)}
                className={
                  " text-lg  w-[258px] bg-[#4785FD] text-white font-bold py-4 px-6  rounded-lg"
                }
              >
                Save Changes
              </Button>
            )}
          </div>
          {disableState ? (
            <div>
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-semibold text-[18px] mb-2"}>
                    Renting or Selling
                  </p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>

                <p className="pt-2 text-[16px]">{formik.values.listingType}</p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px] mb-2"}>Property type</p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>
                <p className="pt-2 text-[16px]">{formik.values.propertyType}</p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px]  mb-4"}>Address</p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>
                <p className="font-semibold text-[14px] ">Address line</p>
                <p className="py-2 text-[16px]">
                  {formik.values.housenumber || "-"}
                </p>

                <p className="font-semibold text-[14px] ">House Number</p>
                <p className="py-2 text-[16px]">
                  {formik.values.housenumber || "-"}
                </p>
                <p className=" font-semibold text-[14px] ">Street</p>

                <p className="py-2 text-[16px]">
                  {formik.values.street || "-"}
                </p>
                <p className=" font-semibold text-[14px] ">City</p>
                <p className="py-2 text-[16px]">{formik.values.city || "-"}</p>
                <p className=" font-semibold text-[14px] ">
                  Administrative area
                </p>

                <p className="py-2 text-[16px]">
                  {formik.values.administrativeArea || "-"}
                </p>
                <p className=" font-semibold text-[14px] ">Postal Code</p>
                <p className="py-2 text-[16px]">
                  {formik.values.postalCode || "-"}
                </p>
                <p className=" font-semibold text-[14px] ">Latitude</p>

                <p className="py-2 text-[16px]">
                  {formik.values.latitude || "-"}
                </p>
                <p className=" font-semibold text-[14px] ">Longitude</p>

                <p className="py-2 text-[16px]">
                  {formik.values.longitude || "-"}
                </p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px]  mb-2"}>Asking Price</p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>

                <p className="pt-2 text-[16px]">{formik.values.price}</p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px] mb-2 "}>
                    General information about the property
                  </p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>
                <span className="mb-2 font-semibold text-[14px] ">Rooms</span>
                <p className="py-2 text-[16px]">{formik?.values?.rooms}</p>

                <span className="mb-2 font-semibold text-[14px] ">
                  Bedrooms
                </span>

                <p className="py-2 text-[16px]">{formik?.values?.bedrooms}</p>

                <span className="mb-2 font-semibold text-[14px] ">
                  Bathrooms
                </span>
                <p className="py-2 text-[16px]">{formik?.values?.bathrooms}</p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px]  mb-2"}>
                    Property characteristics
                  </p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>

                <p className="py-2 text-[16px]">
                  {formik?.values?.characteristics}
                </p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px] mb-2"}>
                    Property dimentions
                  </p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>
                <span className="mb-2 font-semibold text-[14px] ">
                  Total area
                </span>

                <p className="py-2 text-[16px]">{formik?.values?.totalarea}</p>

                <span className="mb-2 font-semibold text-[14px] ">
                  Living area
                </span>

                <p className="py-2 text-[16px]">{formik?.values?.livingarea}</p>

                <span className="mb-2 font-semibold text-[14px] ">
                  Outside area
                </span>

                <p className="py-2 text-[16px]">
                  {formik?.values?.outsidearea}
                </p>

                <span className="mb-2 font-semibold text-[14px] ">Garden</span>

                <p className="py-2 text-[16px]">{formik?.values?.garden}</p>

                <span className="mb-2 font-semibold text-[14px] ">Garage</span>

                <p className="py-2 text-[16px]">{formik?.values?.garage}</p>

                <span className="mb-2 font-semibold text-[14px] ">Volume</span>
                <p className="py-2 text-[16px]">{formik?.values?.volume}</p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px] mb-2"}>Interior type</p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>

                <p className="py-2 text-[16px]">
                  {formik?.values?.interiortype}
                </p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px] mb-2"}>
                    Property condition
                  </p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>

                <p className="py-2 text-[16px]">{formik?.values?.upkeeptype}</p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px]  mb-2"}>Heating type</p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>

                <p className="py-2 text-[16px]">
                  {formik?.values?.heatingtype}
                </p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px]  mb-2"}>
                    Building specifications
                  </p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>
                <span className="mb-2 font-semibold text-[14px] ">
                  Year of built
                </span>

                <p className="py-2 text-[16px]">{formik?.values?.yearBuilt}</p>
                <span className="mb-2 font-semibold text-[14px] ">
                  Floors in the building
                </span>

                <p className="py-2 text-[16px]">
                  {formik?.values?.numberOfFloorsCommon}
                </p>

                <span className="mb-2 font-semibold text-[14px] ">
                  Apartment located at floor number
                </span>

                <p className="py-2 text-[16px]">
                  {formik?.values?.floorNumber}
                </p>

                <span className="mb-2 font-semibold text-[14px] ">
                  Building type
                </span>

                <p className="py-2 text-[16px]">
                  {formik?.values?.buildingtype}
                </p>
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px]  mb-2"}>Images</p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>
                {formik.values.images?.[0]?.url && (
                  <>
                    <p className={"font-bold text-[14px] mb-2"}>Main images</p>
                    <Image
                      width={100}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "fill",
                        marginBottom: "10px",
                      }}
                      height={100}
                      src={formik.values.images?.[0]?.url}
                      alt={"propert"}
                    />
                  </>
                )}
                {formik.values?.images.length > 1 && (
                  <p className={"font-bold text-[14px] mb-2 mt-2"}>
                    Other images
                  </p>
                )}
                {formik.values?.images?.slice(2)?.map((el) => (
                  <Image
                    width={100}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "fill",
                      marginBottom: "10px",
                    }}
                    height={100}
                    src={el?.url}
                    alt={"propert"}
                  />
                ))}
              </div>
              <Divider />
              <div className="detail_single_box">
                <div className="flex justify-between">
                  <p className={"font-bold text-[18px] mb-2"}>
                    Property description
                  </p>
                  {/* <Icon icon={PencilSquareIcon} /> */}
                </div>
                <span className="mb-2 font-bold text-[14px]">Description</span>

                <p className="py-2 text-[16px]">
                  {formik?.values?.discription}
                </p>
              </div>
              <Divider />
              <div>
                {step > 0 && (
                  <Button
                    className="w-[247px] h-[56px] mt-8 mr-8 bg-transparent border border-[#2C72F6] text-[#2C72F6]"
                    onClick={handleBack}
                    disabled={createProperty.isLoading}
                  >
                    Go Back
                  </Button>
                )}
                <Button
                  type="button"
                  disabled={createProperty.isLoading}
                  onClick={confirmBtnHandler}
                  className="w-[247px] h-[56px] mt-8 border border-[#2C72F6]"
                >
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <EditableConfirmationPage formik={formik} />
          )}
        </div>
      )}
    </>
  );
}

export default Confirmation;
