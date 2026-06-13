import { ProfilePageMainContent } from "@/app/components/profilePage/ProfilePageMainContent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { firebaseAdmin } from "@/app/lib/firebase/configAdmin";

type Props = {
  params: Promise<{ tab: string }>;
};
export default async function ProfilePage({ params }: Props) {
  const { tab } = await params;
  const userToken = (await cookies()).get('authToken');
  if (!userToken || !userToken.value) redirect('/signin')

  await firebaseAdmin.auth().verifyIdToken(userToken.value).catch(error => {
    // user is not authenticated
    redirect('/signin');
  });
  // the user is authenticated

  return (
    <div className="container mx-auto">
      <ProfilePageMainContent tab={tab}></ProfilePageMainContent>
    </div>
  );
}
