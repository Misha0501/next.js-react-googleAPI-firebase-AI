"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSendEmail } from "@/providers/ContactForm";

interface FormValues {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
  emailTo?: string;
  subject?: string;
}

type Props = {
  emailTo?: string;
  subject?: string;
};

const ContactFormSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phoneNumber: Yup.string()
    .min(4, "Phone number should be at least 4 digits")
    .max(16, "Phone number may not be greater than 16 digits"),
  email: Yup.string().email("Invalid email").required("Required"),
  message: Yup.string().required("Required"),
});

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-[#2D3648] outline-none transition focus:border-[#1F5FD6] focus:ring-2 focus:ring-[#1F5FD6]/15";

const inputErrorClass =
  "h-10 w-full rounded-xl border border-red-400 bg-white px-3 text-sm text-[#2D3648] outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/15";

export const ContactForm = ({ emailTo, subject }: Props) => {
  const sendEmail = useSendEmail({});

  const initialValues: FormValues = {
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
    emailTo: emailTo ?? "",
    subject: subject ?? "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ContactFormSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });

  const handleFormSubmit = async (values: FormValues) => {
    try {
      await sendEmail.mutateAsync(values);
      formik.resetForm();
      toast.success("Your message has been sent!");
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
    }
  };

  const nameError = formik.errors.name && formik.touched.name;
  const emailError = formik.errors.email && formik.touched.email;
  const phoneError = formik.errors.phoneNumber && formik.touched.phoneNumber;
  const messageError = formik.errors.message && formik.touched.message;

  return (
    <form className="flex flex-col gap-6" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#2D3648]" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Your name"
          className={nameError ? inputErrorClass : inputClass}
        />
        {nameError && (
          <p className="text-sm text-red-600">{formik.errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-[#2D3648]"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Your email"
          className={emailError ? inputErrorClass : inputClass}
        />
        {emailError && (
          <p className="text-sm text-red-600">{formik.errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-[#2D3648]"
          htmlFor="phoneNumber"
        >
          Phone number
        </label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Your phone number"
          className={phoneError ? inputErrorClass : inputClass}
        />
        {phoneError && (
          <p className="text-sm text-red-600">{formik.errors.phoneNumber}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-semibold text-[#2D3648]"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Type your message here"
          className={`h-52 resize-none rounded-xl border bg-white p-3 text-sm text-[#2D3648] outline-none transition focus:ring-2 ${
            messageError
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
              : "border-slate-200 focus:border-[#1F5FD6] focus:ring-[#1F5FD6]/15"
          }`}
        />
        {messageError && (
          <p className="text-sm text-red-600">{formik.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={sendEmail.isLoading}
        className="inline-flex items-center justify-center rounded-xl bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184FB5] disabled:opacity-50"
      >
        {sendEmail.isLoading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};
