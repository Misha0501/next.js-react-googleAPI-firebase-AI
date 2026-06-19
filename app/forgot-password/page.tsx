import type { Metadata } from "next";
import ForgotPasswordPageContent from "@/app/components/forgotPasswordPage/ForgotPasswordPageContent";

export const metadata: Metadata = {
  title: "Reset Your Password",
  description: "Request a link to reset your Homfli account password.",
};

const ForgotPasswordPage = () => {
  return <ForgotPasswordPageContent />;
};

export default ForgotPasswordPage;
