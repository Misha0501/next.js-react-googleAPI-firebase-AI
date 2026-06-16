"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useSendEmail } from "@/providers/ContactForm";
import { Input, Textarea } from "@/app/components/shared/Input";
import { Button } from "@/app/components/shared/Button";

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

  return (
    <form className="flex flex-col gap-6" onSubmit={formik.handleSubmit}>
      <Input
        id="name"
        name="name"
        type="text"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Your name"
        error={formik.errors.name && formik.touched.name ? formik.errors.name : undefined}
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Your email"
        error={formik.errors.email && formik.touched.email ? formik.errors.email : undefined}
      />

      <Input
        id="phoneNumber"
        name="phoneNumber"
        type="text"
        label="Phone number"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Your phone number"
        error={formik.errors.phoneNumber && formik.touched.phoneNumber ? formik.errors.phoneNumber : undefined}
      />

      <Textarea
        id="message"
        name="message"
        label="Message"
        value={formik.values.message}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Type your message here"
        className="h-52 resize-none"
        error={formik.errors.message && formik.touched.message ? formik.errors.message : undefined}
      />

      <Button type="submit" loading={sendEmail.isLoading}>
        {sendEmail.isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};
