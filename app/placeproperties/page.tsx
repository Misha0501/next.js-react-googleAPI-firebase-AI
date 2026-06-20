import type { Metadata } from "next";
import MultiForm from "@/app/components/propertyPlacementEdit";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/lib/auth/session";

export const metadata: Metadata = {
  title: "Place Your Property",
  robots: { index: false },
};

const PlacePropertyPage = async () => {
  const session = await getSessionUser();
  if (!session) redirect("/signin");

  return (
    <>
      <section>
        <MultiForm />
      </section>
    </>
  );
};

export default PlacePropertyPage;
