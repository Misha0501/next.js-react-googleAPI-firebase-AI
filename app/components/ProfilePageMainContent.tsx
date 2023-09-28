"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { signOut } from "@firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useRouter } from "next/navigation";
import { SavedItemsPageTabs } from "@/app/components/SavedItemsPageTabs";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { RecentlyViewedListings } from "@/app/components/RecentlyViewedListings";
import { CompanyTab } from "@/app/components/profile/CompanyTab";
import { InvitesTab } from "@/app/components/profile/InvitesTab";
import { PersonalDetailsTab } from "@/app/components/profile/PersonalDetailsTab";
import { ApplicationUser, Company } from "@/types";
import { PropertiesTab } from "@/app/components/profile/PropertiesTab";
import { ProfilePageOwnListings } from "@/app/components/ProfilePageOwnListings";

type Props = {
  tab: string;
};
export default function ProfilePageMainContent({ tab }: Props) {
  const tabList = [
    "myProperties",
    "saved",
    "myAccount",
    "company",
    "invites",
    "logOut",
  ];
  const activeTab = tabList.indexOf(tab);
  const router = useRouter();
  const { authToken, user } = useAuthContext();
  const [applicationUser, setApplicationUser] =
    useState<ApplicationUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogOut = async () => {
    await signOut(firebaseClientAuth);
    router.push("/");
  };

  // fetch user data
  const fetchUserData = async () => {
    const response = await fetch("/api/users", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    });

    const data: ApplicationUser = await response.json();

    // Check if user is part of a company if so fetch set company
    if (data?.Membership && data?.Membership.length) {
      setCompany(data?.Membership[0].company);
    }
    setApplicationUser(data);
    setIsLoading(false);
  };

  useEffect(() => {
    // redirect to login if not logged in
    if (!user) {
      router.push("/signin");
    }

    console.log("use effect");
    setIsLoading(true);

    fetchUserData().catch((error) => {
      console.error(error.message);
      setIsLoading(false);
      setError("Something went wrong. Please try again later.");
    });
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error} </div>;
  return (
    <div className={"container"}>
      <TabGroup className={"flex min-h-screen"} defaultIndex={activeTab}>
        <TabList className="flex flex-col min-w-[300px] border-r pt-12">
          <div
            className={"flex flex-col gap-2 w-fit mx-auto items-center mb-12"}
          >
            <div className={"font-bold"}>{applicationUser?.displayName}</div>
            <div className={"font-bold"}>{applicationUser?.email}</div>
            {/*<div className={"text-gray-400"}>Visitor/Seller</div>*/}
          </div>
          <div className="h-full w-fit mx-auto">
            <Tab className={"w-fit"}>Properties</Tab>
            <Tab className={"w-fit"}>Saved</Tab>
            <Tab className={"w-fit"}>Personal details</Tab>
            <Tab className={"w-fit"}>Company</Tab>
            <Tab className={"w-fit"}>Invites</Tab>
            <Tab className={"w-fit"}>Recently viewed</Tab>
            <Tab className={"w-fit"} onClick={handleLogOut}>
              Log out
            </Tab>
          </div>
        </TabList>
        <TabPanels className={"pt-12 pl-20"}>
          <TabPanel>
            <p className={"font-bold text-4xl mb-12"}>Properties</p>
            {company && (
              <PropertiesTab
                company={company}
                userListings={applicationUser?.Listing || []}
              />
            )}
            {!company && (
              <ProfilePageOwnListings
                initialListings={applicationUser?.Listing || []}
              ></ProfilePageOwnListings>
            )}
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-12"}>Saved items</p>
            <SavedItemsPageTabs></SavedItemsPageTabs>
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-12"}>Personal details</p>
            <PersonalDetailsTab />
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-12"}>Company</p>
            <CompanyTab></CompanyTab>
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-12"}>Invites</p>
            <InvitesTab></InvitesTab>
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-12"}>Recently viewed</p>
            <RecentlyViewedListings></RecentlyViewedListings>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
