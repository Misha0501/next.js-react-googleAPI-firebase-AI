import {
  ChatBubbleLeftRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { FormikProps } from "formik";
import { PlacingPropertyImagesHandler } from "../propertyPlacementEdit/PlacingPropertyImagesHandler";
import { EditPropertyValues } from "./types";
import { ErrorText, SectionRow } from "./editFormPrimitives";

type Props = {
  formik: FormikProps<EditPropertyValues>;
  showError: boolean;
};

export const EditMediaSection = ({ formik, showError }: Props) => {
  const description = formik.values.description || "";

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
          <textarea
            name="description"
            id="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={description}
            placeholder="Describe the layout, condition, natural light, location and anything buyers should know."
            className="min-h-[190px] w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15"
          />
          {showError && (
            <ErrorText>{formik.errors.description as string}</ErrorText>
          )}
        </div>
      </SectionRow>
    </>
  );
};
