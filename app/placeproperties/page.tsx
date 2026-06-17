import type { Metadata } from "next";
import MultiForm from "@/app/components/propertyPlacementEdit";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { firebaseAdminAuth } from "@/app/lib/firebase/configAdmin";

export const metadata: Metadata = {
  title: "Place Your Property",
  robots: { index: false },
};

const PlacePropertyPage = async () => {
  const userToken = (await cookies()).get("authToken");
  if (!userToken || !userToken.value) redirect("/signin");

  await firebaseAdminAuth.verifyIdToken(userToken.value).catch(() => {
    redirect("/signin");
  });

  return (
    <>
      <section>
        <MultiForm />
      </section>
    </>
  );
};

export default PlacePropertyPage;
