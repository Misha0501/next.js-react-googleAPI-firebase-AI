import type { Metadata } from "next";
import { ProfilePageMainContent } from "@/app/components/profilePage/ProfilePageMainContent";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { firebaseAdminAuth } from "@/app/lib/firebase/configAdmin";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false },
};

type Props = {
  params: Promise<{ tab: string }>;
  searchParams: Promise<{ view?: string }>;
};

const ProfilePage = async ({ params, searchParams }: Props) => {
  const { tab } = await params;
  const { view } = await searchParams;
  const userToken = (await cookies()).get("authToken");
  if (!userToken || !userToken.value) redirect("/signin");

  await firebaseAdminAuth.verifyIdToken(userToken.value).catch(() => {
    redirect("/signin");
  });

  return <ProfilePageMainContent tab={tab} view={view} />;
};

export default ProfilePage;
