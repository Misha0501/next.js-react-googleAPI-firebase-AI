"use client";

import { Button, TextInput } from "@tremor/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSendEmail } from "@/providers/ContactForm";

interface FormValues {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

const ContactFormSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phoneNumber: Yup.string()
    .min(4, "Phone number should be at least 4 digits")
    .max(16, "Phone number may not be greater than 16 digits"),
  email: Yup.string().email("Invalid email").required("Required"),
  message: Yup.string().required("Required"),
});

export const ContactForm = ({}) => {
  const sendEmail = useSendEmail({});

  const initialValues: FormValues = {
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ContactFormSchema,
    onSubmit: (values) => handleFormSubmit(values),
  });
  const handleFormSubmit = async (values: FormValues) => {
    try {
      // send email
      await sendEmail.mutateAsync(values);
      formik.resetForm();
      toast.success("Your message has been sent!");
    } catch (error) {
      toast.error("Something went wrong, please try again later.");
    }
  };

  return (
    <form className="flex flex-col gap-6 mt-12" onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <TextInput
          type={"text"}
          id={"name"}
          name={"name"}
          defaultValue={formik.values.name}
          placeholder={"Your name"}
          onChange={(event) => {
            formik.values.name = event.target.value;
          }}
          errorMessage={
            formik.errors.name && formik.touched.name
              ? formik.errors.name
              : undefined
          }
          error={formik.errors.name && formik.touched.name ? true : undefined}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <TextInput
          type="email"
          placeholder={"Your email"}
          id="email"
          name="email"
          onChange={(event) => {
            formik.values.email = event.target.value;
          }}
          errorMessage={
            formik.errors.email && formik.touched.email
              ? formik.errors.email
              : undefined
          }
          error={formik.errors.email && formik.touched.email ? true : undefined}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Phone number</label>
        <TextInput
          type="text"
          placeholder={"Your phone number"}
          id="phone"
          name="phone"
          onChange={(event) => {
            formik.values.phoneNumber = event.target.value;
          }}
          errorMessage={
            formik.errors.phoneNumber && formik.touched.phoneNumber
              ? formik.errors.phoneNumber
              : undefined
          }
          error={
            formik.errors.phoneNumber && formik.touched.phoneNumber
              ? true
              : undefined
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="message">Message</label>
        <div
          className={
            "tremor-TextInput-root relative w-full flex items-center min-w-[10rem] outline-none rounded-tremor-default shadow-tremor-input dark:shadow-dark-tremor-input bg-tremor-background dark:bg-dark-tremor-background hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content border-tremor-border dark:border-dark-tremor-border border"
          }
        >
          <textarea
            className={
              "h-52 resize-none tremor-TextInput-input w-full focus:outline-none focus:ring-0 border-none bg-transparent text-tremor-default text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pl-3 pr-4 py-2 placeholder:text-tremor-content dark:placeholder:text-dark-tremor-content"
            }
            id="message"
            placeholder={"Type your message here"}
            name="message"
            onChange={(event) => {
              formik.values.message = event.target.value;
            }}
          ></textarea>
        </div>
        {formik.errors.message && formik.touched.message && (
          <div className="text-sm text-red-500">{formik.errors.message}</div>
        )}
      </div>
      <Button type={"submit"} loading={sendEmail.isLoading}>
        Send
      </Button>
    </form>
  );
};
