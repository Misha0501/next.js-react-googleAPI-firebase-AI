import type { Metadata } from "next";
import UserPageMain from "@/app/components/usersPage";

export const metadata: Metadata = {
  title: "Agent & Owner Profile",
  description:
    "View property listings from this agent or private owner on Homfli.",
};

const UserPage = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <UserPageMain />
    </div>
  );
};

export default UserPage;
