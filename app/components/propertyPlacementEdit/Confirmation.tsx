import React, { useEffect, useState } from "react";
import Image from "next/image";
import NextToConfirmationPage from "./NextToConfirmationPage";
import { useCreateProperty } from "@/providers/Listing";
import { useAuthContext } from "@/app/context/AuthContext";
import { Listing, ListingImage } from "@/types";
import { toast } from "react-toastify";
import { FormikProps } from "formik";
import {
  ArrowLeftIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  HomeModernIcon,
  MapPinIcon,
  PhotoIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { formatEuroPrice } from "@/app/lib/formatPrice";
import {
  PlacementFormValues,
  getAllPlacementFields,
  validatePlacementValues,
  applyStepErrors,
} from "./validation";

interface CreatePropertyComponentPropInterface {
  formik: FormikProps<PlacementFormValues>;
  handleBack?: () => void;
  step: number;
  isShow: boolean;
}

type SummaryItem = {
  label: string;
  value: React.ReactNode;
};

type SummarySectionProps = {
  icon: React.ReactNode;
  title: string;
  items: SummaryItem[];
};

const labelize = (value?: string | null) => {
  if (!value) return "-";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
};

const valueOrDash = (value: unknown, suffix = "") => {
  if (value === null || value === undefined || value === "") return "-";

  return `${value}${suffix}`;
};

const SummarySection = ({ icon, title, items }: SummarySectionProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
        {icon}
      </span>
      <h3 className="text-base font-bold text-[#1F2937]">{title}</h3>
    </div>
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-[#F8FAFC] p-4">
          <dt className="text-xs font-bold uppercase text-[#64748B]">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-bold text-[#1F2937]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

function Confirmation({
  formik,
  handleBack,
  step,
}: CreatePropertyComponentPropInterface) {
  const { authToken } = useAuthContext();
  const createProperty = useCreateProperty({ authToken: authToken });
  const [createError, setCreateError] = useState("");
  const [createdProperty, setCreatedProperty] = useState<Listing | null>(null);
  const [openAdvertisementSection, setOpenAdvertisementSection] =
    useState(false);

  const values = formik.values;
  const isLand = values.propertyType === "LAND";
  const addressLine = [values.streetNumber, values.route]
    .filter(Boolean)
    .join(" ");

  const confirmBtnHandler = () => {
    const errors = validatePlacementValues(values);

    if (Object.keys(errors).length > 0) {
      applyStepErrors(formik, getAllPlacementFields(values), errors);
      toast.error("Please complete the required fields before publishing.");
      return;
    }

    const payload: any = {
      listingType: values.listingType || null,
      propertyType: values.propertyType || null,
      currency: values.currency,
      price: values.price,
      rooms: values.rooms,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      areaTotal: values.totalArea,
      areaLiving: values.livingArea,
      areaOutside: values.areaOutside,
      areaGarage: values.areaGarage,
      volume: values.volume,
      parking: values.parking,
      interiorType: values.interiorType || null,
      upkeepType: values.upkeepType || null,
      heatingType: values.heatingType || null,
      constructedYear: values.constructedYear,
      numberOfFloorsCommon: values.numberOfFloorsCommon,
      floorNumber: values.floorNumber,
      buildingType: values.buildingType || null,
      characteristics: values.characteristics,
      description: values.description,
      address: {
        route: values.route,
        administrativeAreaLevelOne: values.administrativeArea,
        locality: values.locality,
        streetNumber: values.streetNumber,
        neighborhood: values.neighborhood,
        postalCode: values.postalCode,
        latitude: values.latitude,
        longitude: values.longitude,
      },
      images: values.images,
    };

    setCreateError("");
    createProperty.mutate(payload);
  };

  useEffect(() => {
    if (createProperty.isSuccess) {
      setCreatedProperty(createProperty.data);
      setOpenAdvertisementSection(true);
      toast.success("Property created successfully");
    }
  }, [createProperty?.isSuccess, createProperty.data]);

  useEffect(() => {
    if (createProperty.isError) {
      setCreateError("Oops, something went wrong. Please try again later.");
      toast.error("Oops, something went wrong. Please try again later.");
    }
  }, [createProperty?.isError]);

  const overviewItems: SummaryItem[] = [
    { label: "Listing intent", value: labelize(values.listingType) },
    { label: "Property type", value: labelize(values.propertyType) },
    {
      label: "Asking price",
      value: formatEuroPrice(values.price, { fallback: "-" }),
    },
    { label: "Currency", value: values.currency || "EUR" },
  ];

  const addressItems: SummaryItem[] = [
    { label: "Address", value: addressLine || "-" },
    { label: "Neighborhood", value: values.neighborhood || "-" },
    { label: "City", value: values.locality || "-" },
    { label: "Administrative area", value: values.administrativeArea || "-" },
    { label: "Postal code", value: values.postalCode || "-" },
    {
      label: "Coordinates",
      value:
        values.latitude && values.longitude
          ? `${values.latitude}, ${values.longitude}`
          : "-",
    },
  ];

  const dimensionItems: SummaryItem[] = [
    {
      label: isLand ? "Plot area" : "Total area",
      value: valueOrDash(values.totalArea, " m²"),
    },
  ];

  if (!isLand) {
    dimensionItems.push(
      { label: "Living area", value: valueOrDash(values.livingArea, " m²") },
      { label: "Outside area", value: valueOrDash(values.areaOutside, " m²") },
      { label: "Garage area", value: valueOrDash(values.areaGarage, " m²") },
      { label: "Volume", value: valueOrDash(values.volume, " m³") },
    );
  }

  const detailItems: SummaryItem[] = isLand
    ? []
    : [
        { label: "Rooms", value: valueOrDash(values.rooms) },
        { label: "Bedrooms", value: valueOrDash(values.bedrooms) },
        { label: "Bathrooms", value: valueOrDash(values.bathrooms) },
        { label: "Parking places", value: valueOrDash(values.parking) },
        { label: "Interior", value: labelize(values.interiorType) },
        { label: "Condition", value: labelize(values.upkeepType) },
        { label: "Heating", value: labelize(values.heatingType) },
        { label: "Year built", value: valueOrDash(values.constructedYear) },
        {
          label: "Floors in building",
          value: valueOrDash(values.numberOfFloorsCommon),
        },
        { label: "Property floor", value: valueOrDash(values.floorNumber) },
      ];

  if (openAdvertisementSection) {
    return <NextToConfirmationPage listingItem={createdProperty} />;
  }

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
          Step 4
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] md:text-4xl">
              Review and publish
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B] md:text-base">
              Check the listing details before it goes live. Use Back if
              anything needs adjusting.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#CFE0FF] bg-[#F6F9FF] px-4 py-3 text-sm font-bold text-[#1F5FD6]">
            <CheckBadgeIcon className="h-5 w-5" />
            Ready for final check
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <SummarySection
            icon={<HomeModernIcon className="h-5 w-5" />}
            title="Overview"
            items={overviewItems}
          />
          <SummarySection
            icon={<MapPinIcon className="h-5 w-5" />}
            title="Location"
            items={addressItems}
          />
          <SummarySection
            icon={<Squares2X2Icon className="h-5 w-5" />}
            title="Dimensions"
            items={dimensionItems}
          />
          {!isLand && (
            <SummarySection
              icon={<DocumentTextIcon className="h-5 w-5" />}
              title="Details"
              items={detailItems}
            />
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#1F5FD6]">
                <PhotoIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Photos</h3>
                <p className="text-sm text-[#64748B]">
                  {values.images?.length || 0} uploaded
                </p>
              </div>
            </div>
            {values.images?.length ? (
              <div className="grid gap-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    alt="Main property image"
                    src={values.images[0].url}
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#1F2937] shadow-sm">
                    Main image
                  </span>
                </div>
                {values.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {values.images
                      .slice(1, 4)
                      .map((image: ListingImage, index: number) => (
                        <div
                          key={`${image.url}-${index}`}
                          className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"
                        >
                          <Image
                            alt="Property image"
                            src={image.url}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-sm font-semibold text-[#64748B]">
                No photos uploaded.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-[#1F2937]">
              Description
            </h3>
            <p className="whitespace-pre-line text-sm leading-6 text-[#4A5468]">
              {values.description || "-"}
            </p>
          </section>
        </aside>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={createProperty.isLoading}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#334155] transition hover:border-[#1F5FD6] hover:text-[#1F5FD6] disabled:opacity-50 sm:w-auto"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          )}
          <button
            type="button"
            disabled={createProperty.isLoading}
            onClick={confirmBtnHandler}
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#1F5FD6] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] disabled:opacity-50 sm:w-auto"
          >
            {createProperty.isLoading ? "Publishing..." : "Publish listing"}
          </button>
        </div>
        {createError && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {createError}
          </p>
        )}
      </div>
    </div>
  );
}

export default Confirmation;
