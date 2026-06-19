import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordPageContent from "@/app/components/resetPasswordPage/ResetPasswordPageContent";

export const metadata: Metadata = {
  title: "Set a New Password",
  description: "Choose a new password for your Homfli account.",
};

const ResetPasswordPage = () => {
  return (
    <Suspense>
      <ResetPasswordPageContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
