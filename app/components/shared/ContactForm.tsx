"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSendEmail } from "@/providers/ContactForm";
import { Input, Textarea } from "@/app/components/shared/Input";
import { Button } from "@/app/components/shared/Button";
import { useMemo, useState } from "react";

interface FormValues {
  name: string;
  phoneNumber: string;
  email: string;
  companyWebsite: string;
  message: string;
  emailTo?: string;
  subject?: string;
}

type Props = {
  emailTo?: string;
  subject?: string;
  showSubject?: boolean;
  showPhone?: boolean;
  requireMessageMinLength?: boolean;
  successMode?: "toast" | "inline";
  submitLabel?: string;
};

const SUBJECT_OPTIONS = [
  "General inquiry",
  "Listing question",
  "Privacy/data request",
  "Technical issue",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#1F2937] outline-none transition placeholder:text-slate-400 focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15 disabled:bg-slate-50 disabled:text-slate-400";

export const ContactForm = ({
  emailTo,
  subject,
  showSubject = false,
  showPhone = true,
  requireMessageMinLength = false,
  successMode = "toast",
  submitLabel = "Send",
}: Props) => {
  const sendEmail = useSendEmail({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validationSchema = useMemo(() => {
    const messageValidator = requireMessageMinLength
      ? Yup.string()
          .min(20, "Message must be at least 20 characters")
          .required("Message is required")
      : Yup.string().required("Message is required");

    return Yup.object().shape({
      name: Yup.string().required("Name is required"),
      phoneNumber: showPhone
        ? Yup.string()
            .min(4, "Phone number should be at least 4 digits")
            .max(16, "Phone number may not be greater than 16 digits")
        : Yup.string(),
      email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
      subject: showSubject
        ? Yup.string().required("Subject is required")
        : Yup.string(),
      companyWebsite: Yup.string(),
      message: messageValidator,
    });
  }, [requireMessageMinLength, showPhone, showSubject]);

  const initialValues: FormValues = {
    name: "",
    phoneNumber: "",
    email: "",
    companyWebsite: "",
    message: "",
    emailTo: emailTo ?? "",
    subject: subject ?? "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleFormSubmit = async (values: FormValues) => {
    try {
      setSubmitError("");
      await sendEmail.mutateAsync(values);
      formik.resetForm();
      if (successMode === "inline") {
        setSuccess(true);
      } else {
        toast.success("Your message has been sent!");
      }
    } catch (error) {
      const message = "Something went wrong, please try again later.";
      if (successMode === "inline") {
        setSubmitError(message);
      } else {
        toast.error(message);
      }
    }
  };

  if (success && successMode === "inline") {
    return (
      <div
        className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-sm leading-6 text-emerald-800"
        role="status"
      >
        Thank you. Your message has been sent to the Homfli team. We typically
        respond within 2-3 business days.
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={formik.handleSubmit}>
      {submitError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {submitError}
        </p>
      )}

      <input
        type="text"
        name="companyWebsite"
        value={formik.values.companyWebsite}
        onChange={formik.handleChange}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <Input
        id="name"
        name="name"
        type="text"
        label="Name *"
        aria-label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Your name"
        error={
          formik.errors.name && formik.touched.name
            ? formik.errors.name
            : undefined
        }
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email *"
        aria-label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Your email"
        error={
          formik.errors.email && formik.touched.email
            ? formik.errors.email
            : undefined
        }
      />

      {showPhone && (
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          label="Phone number"
          aria-label="Phone number"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Your phone number"
          error={
            formik.errors.phoneNumber && formik.touched.phoneNumber
              ? formik.errors.phoneNumber
              : undefined
          }
        />
      )}

      {showSubject && (
        <div>
          <label
            className="mb-1.5 block text-sm font-semibold text-[#1F2937]"
            htmlFor="subject"
          >
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            aria-label="Subject"
            value={formik.values.subject}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {formik.errors.subject && formik.touched.subject && (
            <p className="mt-1.5 text-xs font-semibold text-red-600">
              {formik.errors.subject}
            </p>
          )}
        </div>
      )}

      <Textarea
        id="message"
        name="message"
        label="Message *"
        aria-label="Message"
        value={formik.values.message}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Type your message here"
        className="h-52 resize-none"
        error={
          formik.errors.message && formik.touched.message
            ? formik.errors.message
            : undefined
        }
      />

      <Button
        type="submit"
        loading={sendEmail.isPending}
        disabled={!formik.isValid || !formik.dirty || sendEmail.isPending}
        fullWidth
      >
        {sendEmail.isPending ? "Sending..." : submitLabel}
      </Button>
    </form>
  );
};
