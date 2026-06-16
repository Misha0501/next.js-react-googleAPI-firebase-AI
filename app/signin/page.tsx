import type { Metadata } from "next";
import SignInPageContent from "@/app/components/signInUpPage/SignInPageContent";

export const metadata: Metadata = {
  title: "Sign In or Create Account",
  description:
    "Sign in to your Homfli account or create a new one to save listings and place properties.",
};

const SignInPage = () => {
  return <SignInPageContent />;
};

export default SignInPage;
