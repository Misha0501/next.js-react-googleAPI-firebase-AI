import type { Metadata } from "next";
import EditProperty from "@/app/components/editProperty";

export const metadata: Metadata = {
  title: "Edit Property",
  robots: { index: false },
};

const EditPage = () => {
  return <EditProperty />;
};

export default EditPage;
