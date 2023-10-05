"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { signOut } from "@firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useRouter } from "next/navigation";
import { SavedItemsPageTabs } from "@/app/components/listingsPage/profilePage/SavedItemsPageTabs";
import { useMemo } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { RecentlyViewedListings } from "@/app/components/listingsPage/profilePage/RecentlyViewedListings";
import { CompanyTab } from "@/app/components/listingsPage/profilePage/CompanyTab";
import { InvitesTab } from "@/app/components/listingsPage/profilePage/InvitesTab";
import { PersonalDetailsTab } from "@/app/components/listingsPage/profilePage/PersonalDetailsTab";
import { PropertiesTab } from "@/app/components/listingsPage/profilePage/PropertiesTab";
import { ProfilePageOwnListings } from "@/app/components/listingsPage/profilePage/ProfilePageOwnListings";
import { useUserOwnData } from "@/providers/Users";
import { CircularProgress } from "@mui/material";

type Props = {
  tab: string;
};
export const ProfilePageMainContent = ({ tab }: Props) => {
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

  const { data: applicationUser, isLoading, error} = useUserOwnData({ authToken });

  const company = useMemo(() => {
    if (applicationUser?.Membership && applicationUser?.Membership.length) {
      return applicationUser?.Membership[0].company;
    }

    return null;
  }, [applicationUser]);

  const handleLogOut = async () => {
    await signOut(firebaseClientAuth);
    router.push("/");
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <p className={"text-red-500"}>Oops something went wrong, please try again later</p>;
  return (
    <div className={""}>
      <TabGroup
        className={"flex flex-col md:flex-row min-h-screen pb-20"}
        defaultIndex={activeTab}
      >
        <TabList className="flex flex-col min-w-[300px] border-none md:border-r pt-12">
          <div
            className={"flex flex-col gap-2 w-fit mx-auto items-center mb-12"}
          >
            <div className={"font-bold"}>{applicationUser?.displayName}</div>
            <div className={"font-bold"}>{applicationUser?.email}</div>
            {/*<div className={"text-gray-400"}>Visitor/Seller</div>*/}
          </div>
          <div className="">
            <div className="h-full mx-auto flex flex-row md:flex-col w-full overflow-x-auto overflow-y-hidden no-scrollbar">
              <Tab className={"w-fit text-clip"}>Properties</Tab>
              <Tab className={"w-fit text-clip"}>Saved</Tab>
              <Tab className={"w-fit text-clip"}>Personal details</Tab>
              <Tab className={"w-fit text-clip"}>Company</Tab>
              <Tab className={"w-fit text-clip"}>Invites</Tab>
              <Tab className={"w-fit text-clip"}>Recently viewed</Tab>
              <Tab className={"w-fit text-clip"} onClick={handleLogOut}>
                Log out
              </Tab>
            </div>
          </div>
        </TabList>
        <TabPanels className={"pt-12 pl:1 md:pl-20"}>
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
};
