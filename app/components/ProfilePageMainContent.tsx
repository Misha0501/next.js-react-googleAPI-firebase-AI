"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react";
import { signOut } from "@firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useRouter } from "next/navigation";
import { SavedItemsPageTabs } from "@/app/components/SavedItemsPageTabs";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { ProfilePageOwnListings } from "@/app/components/ProfilePageOwnListings";
import { RecentlyViewedListings } from "@/app/components/RecentlyViewedListings";

type Props = {
  tab: string;
};
export default function ProfilePageMainContent({ tab }: Props) {
  const tabList = ["myProperties", "saved", "myAccount", "logOut"];
  const activeTab = tabList.indexOf(tab);
  const router = useRouter();
  const { authToken, user } = useAuthContext();
  const [applicationUser, setApplicationUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  const handleLogOut = async () => {
    await signOut(firebaseClientAuth);
    router.push("/");
  };

  // fetch user data
  const fetchUserData = async () => {
    const response = await fetch("/api/user", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    });

    const data = await response.json();
    console.log("datadatadatadata");
    console.log(data);
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
            className={"flex flex-col gap-2 w-fit mx-auto items-center mb-8"}
          >
            <div className={"font-bold"}>{applicationUser?.displayName}</div>
            <div className={"text-gray-400"}>Visitor/Seller</div>
          </div>
          <div className="h-full w-fit mx-auto">
            <Tab className={"w-fit"}>My properties</Tab>
            <Tab className={"w-fit"}>Saved</Tab>
            <Tab className={"w-fit"}>Personal details</Tab>
            <Tab className={"w-fit"}>Recently viewed</Tab>
            <Tab className={"w-fit"} onClick={handleLogOut}>Log out</Tab>
          </div>
        </TabList>
        <TabPanels className={"pt-12 pl-20"}>
          <TabPanel>
            <p className={"font-bold text-4xl mb-8"}>Own listings</p>
            <ProfilePageOwnListings initialListings={applicationUser?.Listing}></ProfilePageOwnListings>
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-8"}>Saved items</p>
            <SavedItemsPageTabs></SavedItemsPageTabs>
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-8"}>Personal details</p>
          </TabPanel>
          <TabPanel>
            <p className={"font-bold text-4xl mb-8"}>Recently viewed</p>
            <RecentlyViewedListings></RecentlyViewedListings>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
