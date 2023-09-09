import { redirectToSignInIfNotLoggedInSSR } from "@/app/lib/redirectToSignInIfNotLoggedInSSR";
import { auth } from "firebase-admin";
import DecodedIdToken = auth.DecodedIdToken;

export default async function ProfilePage() {
  const { user }: DecodedIdToken = await redirectToSignInIfNotLoggedInSSR();

  return (
    <div>
      <h1 className="text-5xl">Profile Page! Should be protected</h1>
    </div>
    );
}