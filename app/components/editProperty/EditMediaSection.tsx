import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { FormikProps } from "formik";
import { PlacingPropertyImagesHandler } from "@/app/components/propertyPlacementEdit/PlacingPropertyImagesHandler";
import { EditPropertyValues } from "@/app/components/editProperty/types";
import { ErrorText, SectionRow } from "@/app/components/editProperty/editFormPrimitives";
import { AIGenerateBox } from "@/app/components/propertyPlacementEdit/DescriptionAndImages";
import { useGenerateDescription } from "@/providers/GenerateDescription";

type Props = {
  formik: FormikProps<EditPropertyValues>;
  showError: boolean;
};

export const EditMediaSection = ({ formik, showError }: Props) => {
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const { generate, isLoading, isError } = useGenerateDescription();

  const description =
    streamingText !== null ? streamingText : formik.values.description || "";

  const generateDescription = async () => {
    setStreamingText("");
    const v = formik.values;
    const finalText = await generate(
      {
        listingType: v.listingType || null,
        propertyType: v.propertyType || null,
        interiorType: v.interiorType || null,
        currency: v.currency ?? "",
        price: v.price ?? "",
        rooms: v.rooms,
        bathrooms: v.bathrooms,
        bedrooms: v.bedrooms,
        floorNumber: v.floorNumber,
        numberOfFloorsCommon: v.numberOfFloorsCommon,
        heatingType: v.heatingType || null,
        areaLand: v.totalArea,
        areaLiving: v.livingArea,
        areaTotal: v.totalArea,
        upkeepType: v.upkeepType || null,
        constructedYear: v.constructedYear,
        areaOutside: v.areaOutside,
        areaGarage: v.areaGarage,
        locality: v.locality,
        neighborhood: v.neighborhood,
      },
      (accumulated) => setStreamingText(accumulated),
    );
    formik.setFieldValue("description", finalText, false);
    setStreamingText(null);
  };

  return (
    <>
      <SectionRow
        icon={<PhotoIcon className="h-5 w-5" />}
        title="Photos"
        description="Photos are optional. If present, the first image remains the main property image."
      >
        <PlacingPropertyImagesHandler
          initialImages={formik.values.images || []}
          onChange={(images) => formik.setFieldValue("images", images, true)}
        />
      </SectionRow>

      <SectionRow
        icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
        title="Description"
        description="Keep the public property copy accurate and useful for buyers."
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
            name="description"
            id="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={description}
            placeholder="Describe the layout, condition, natural light, location and anything buyers should know."
            className="focus:ring-[#1F5FD6]/15 min-h-[190px] w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 disabled:bg-slate-50"
          />
          {showError && (
            <ErrorText>{formik.errors.description as string}</ErrorText>
          )}
        </div>
      </SectionRow>
    </>
  );
};
