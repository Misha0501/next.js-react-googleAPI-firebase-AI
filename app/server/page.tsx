import {redirectToSignInIfNotLoggedInSSR} from "@/app/lib/redirectToSignInIfNotLoggedInSSR";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { firebaseAdmin } from "@/app/lib/firebase/configAdmin";

export default async function ServerPage() {
  const userToken = cookies().get('authToken');
  if (!userToken || !userToken.value) redirect('/signin')

  const decodedIdToken = await firebaseAdmin.auth().verifyIdToken(userToken.value).catch(error => {
    // user is not authenticated
    redirect('/signin');
  });
  // the user is authenticated!

    return (
        <>
            <div className="flex items-center justify-between font-sans text-sm flex-col">
                <Link href="/">Go to Home page</Link>
                <Link href="/signin">Go to Login page</Link>
                <Link href="/server">Go to Server page</Link>
            </div>
            <section className="flex flex-col gap-6">
                This is an example of server side auth check
                Logged in
                {JSON.stringify(decodedIdToken)}
            </section>
        </>

    )

}
