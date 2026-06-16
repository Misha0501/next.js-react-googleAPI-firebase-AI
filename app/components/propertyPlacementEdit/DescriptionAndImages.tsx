import React, { useEffect, useState } from "react";
import StepsTopInfo from "./StepsTopInfo";
import property1 from "@/public/property1.png";
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { ListingImage } from "@/types";
import { PlacingPropertyImagesHandler } from "@/app/components/propertyPlacementEdit/PlacingPropertyImagesHandler";
import { useGenerateDescription } from "@/providers/GenerateDescription";
import { FormikProps } from "formik";
import {
  applyStepErrors,
  getDescriptionFields,
  PlacementFormValues,
  validateDescriptionAndImages,
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

function DescriptionAndImages({
  formik,
  handleBack,
  step,
  handleNext,
  isShow,
}: CreatePropertyComponentPropInterface) {
  const [show, setShow] = useState(true);
  const [showError, setShowErrors] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const { generate, isLoading, isError } = useGenerateDescription();

  const handleImagesChange = (images: ListingImage[]) => {
    formik.setFieldValue("images", images, true);
    formik.setFieldTouched("images", true, false);
  };

  const generateDescription = async () => {
    setStreamingText("");
    const finalText = await generate(
      {
        listingType: formik.values.listingType || null,
        propertyType: formik.values.propertyType || null,
        interiorType: formik.values.interiorType || null,
        currency: formik.values.currency,
        price: formik.values.price,
        rooms: formik.values.rooms,
        bathrooms: formik.values.bathrooms,
        bedrooms: formik.values.bedrooms,
        floorNumber: formik.values.floorNumber,
        numberOfFloorsCommon: formik.values.numberOfFloorsCommon,
        heatingType: formik.values.heatingType || null,
        areaLand: formik.values.totalArea,
        areaLiving: formik.values.livingArea,
        areaTotal: formik.values.totalArea,
        upkeepType: formik.values.upkeepType || null,
        constructedYear: formik.values.constructedYear,
        areaOutside: formik.values.areaOutside,
        areaGarage: formik.values.areaGarage,
        locality: formik.values.locality,
        neighborhood: formik.values.neighborhood,
      },
      (accumulated) => setStreamingText(accumulated),
    );
    formik.setFieldValue("description", finalText, false);
    setStreamingText(null);
  };

  const handleContinue = () => {
    const errors = validateDescriptionAndImages(formik.values);
    applyStepErrors(formik, getDescriptionFields(), errors);

    if (Object.keys(errors).length === 0) {
      handleNext();
      return;
    }

    setShowErrors(true);
  };

  const description =
    streamingText !== null ? streamingText : formik.values.description || "";
  const stepNumber = "Step 3";

  return (
    <div className="mx-auto max-w-screen-xl">
      {isShow && show ? (
        <StepsTopInfo
          stepNumber={stepNumber}
          title="Make the property feel complete"
          description="Add photos if they are available and write a clear description. This is the part that turns property data into a page people can picture themselves visiting."
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
              Photos and description
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#64748B] md:text-base">
              Add enough visual context and describe the best qualities of the
              property in plain language.
            </p>
          </div>

          <div className="mt-4">
            <SectionRow
              icon={<PhotoIcon className="h-5 w-5" />}
              title="Property photos"
              description="Photos are optional. If you upload any, the first image becomes the main property image."
            >
              <PlacingPropertyImagesHandler
                initialImages={formik.values.images || []}
                onChange={handleImagesChange}
              />
            </SectionRow>

            <SectionRow
              icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
              title="Description"
              description="Mention the space, light, condition, location and any details that make the property easier to evaluate."
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <label
                    className="block text-sm font-bold text-[#1F2937]"
                    htmlFor="description"
                  >
                    Property description
                  </label>
                  <span className="text-xs font-semibold text-[#64748B]">
                    {description.trim().length} characters
                  </span>
                </div>

                <AIGenerateBox
                  isLoading={isLoading}
                  isError={isError}
                  onGenerate={generateDescription}
                />

                <textarea
                  disabled={isLoading}
                  onChange={(event) => {
                    formik.setFieldValue(
                      "description",
                      event.target.value,
                      true,
                    );
                  }}
                  onBlur={formik.handleBlur}
                  value={description}
                  name="description"
                  id="description"
                  placeholder="Describe the layout, condition, natural light, location and anything buyers should know."
                  className="focus:ring-[#1F5FD6]/15 min-h-[190px] w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 disabled:bg-slate-50"
                />
                {showError && (
                  <ErrorText>{formik.errors.description as string}</ErrorText>
                )}
              </div>
            </SectionRow>
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
              disabled={isLoading}
              className="inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#1F5FD6] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] disabled:opacity-50 sm:w-auto"
            >
              Continue to review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AIGenerateBox({
  isLoading,
  isError,
  onGenerate,
}: {
  isLoading: boolean;
  isError: boolean;
  onGenerate: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setElapsed(0);
      return;
    }
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isLoading]);

  const loadingPhase =
    elapsed < 5
      ? "Analysing property details…"
      : elapsed < 15
        ? "Writing your description… this usually takes ~20 s"
        : "Almost there…";

  return (
    <div className="mb-4 rounded-xl border border-[#CFE0FF] bg-gradient-to-r from-[#F0F5FF] to-[#F6F9FF] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1F5FD6] text-white">
            <SparklesIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#1F2937]">Generate with AI</p>
            <p className="mt-0.5 text-xs text-[#596579]">
              {isLoading
                ? loadingPhase
                : "Create a first draft from the property details you've filled in."}
            </p>
            {isError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1F5FD6] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#184FB5] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {elapsed}s
            </>
          ) : (
            <>
              <SparklesIcon className="h-3.5 w-3.5" />
              Generate
            </>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="mt-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-[#CFE0FF]">
            <div
              className="h-full rounded-full bg-[#1F5FD6] transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min((elapsed / 20) * 100, 95)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DescriptionAndImages;
