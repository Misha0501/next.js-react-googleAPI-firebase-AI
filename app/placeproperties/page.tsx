import MultiForm  from "../components/propertyPlacementEdit";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { firebaseAdmin } from "@/app/lib/firebase/configAdmin";

async function PlacePropertyPage() {
  const userToken = cookies().get('authToken');
  if (!userToken || !userToken.value) redirect('/signin')

  await firebaseAdmin.auth().verifyIdToken(userToken.value).catch(error => {
    // user is not authenticated
    redirect('/signin');
  });
  // the user is authenticated!

  return (
    <>
      <section>
        <MultiForm />
      </section>
    </>
  );
}

export default PlacePropertyPage;
