import type { Metadata } from "next";
import UserPageMain from "@/app/components/usersPage";
import type { UserProfileMode } from "@/app/components/usersPage";

export const metadata: Metadata = {
  title: "Agent & Owner Profile",
  description:
    "View property listings from this agent or private owner on Homfli.",
};

type UserPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getProfileMode = (
  value: string | string[] | undefined,
): UserProfileMode | undefined => {
  const mode = Array.isArray(value) ? value[0] : value;

  if (mode === "personal" || mode === "company") {
    return mode;
  }

  return undefined;
};

const UserPage = async ({ searchParams }: UserPageProps) => {
  const query = await searchParams;
  const profileMode = getProfileMode(query?.profile);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <UserPageMain profileMode={profileMode} />
    </div>
  );
};

export default UserPage;
