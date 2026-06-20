import type { Metadata } from "next";
import { ProfilePageMainContent } from "@/app/components/profilePage/ProfilePageMainContent";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/lib/auth/session";

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
  const session = await getSessionUser();
  if (!session) redirect("/signin");

  return <ProfilePageMainContent tab={tab} view={view} />;
};

export default ProfilePage;
