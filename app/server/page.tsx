import {redirectToSignInIfNotLoggedInSSR} from "@/app/lib/redirectToSignInIfNotLoggedInSSR";
import {auth} from "firebase-admin";
import DecodedIdToken = auth.DecodedIdToken;
import Link from "next/link";

export default async function ServerPage() {
    const user: DecodedIdToken = await redirectToSignInIfNotLoggedInSSR();

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
                {JSON.stringify(user)}
            </section>
        </>

    )

}
