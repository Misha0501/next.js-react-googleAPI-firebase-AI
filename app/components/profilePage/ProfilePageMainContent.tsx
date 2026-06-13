"use client";

import { signOut } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useRouter } from "next/navigation";
import { SavedItemsPageTabs } from "@/app/components/profilePage/SavedItemsPageTabs";
import { useMemo, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { RecentlyViewedListings } from "@/app/components/profilePage/RecentlyViewedListings";
import { CompanyTab } from "@/app/components/profilePage/CompanyTab";
import { InvitesTab } from "@/app/components/profilePage/InvitesTab";
import { PersonalDetailsTab } from "@/app/components/profilePage/PersonalDetailsTab";
import { PropertiesTab } from "@/app/components/profilePage/PropertiesTab";
import { ProfilePageOwnListings } from "@/app/components/profilePage/ProfilePageOwnListings";
import { useUserOwnData } from "@/providers/Users";
import { CircularProgress, Skeleton } from "@mui/material";
import { Listing } from "@/types";

type Props = {
  tab: string;
};

const URL_TAB_MAP: Record<string, number> = {
  myProperties: 0,
  saved: 1,
  myAccount: 2,
  company: 3,
  invites: 4,
};

const TAB_LABELS = [
  "Properties",
  "Saved",
  "Personal details",
  "Company",
  "Invites",
  "Recently viewed",
  "Log out",
];

const TAB_BASE =
  "flex shrink-0 whitespace-nowrap outline-none focus:ring-0 text-sm transition duration-100 -mb-px px-3 py-2";
const TAB_ACTIVE = "border-b-2 border-[#1F5FD6] text-[#1F5FD6]";
const TAB_INACTIVE =
  "border-b border-transparent text-gray-500 hover:border-b-2 hover:border-gray-500 hover:text-gray-700";

export const ProfilePageMainContent = ({ tab }: Props) => {
  const [activeIndex, setActiveIndex] = useState(URL_TAB_MAP[tab] ?? 0);
  const router = useRouter();
  const { authToken } = useAuthContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    data: applicationUser,
    isLoading,
    error,
  } = useUserOwnData({ authToken });

  const company = useMemo(() => {
    if (applicationUser?.Membership && applicationUser?.Membership.length) {
      return applicationUser?.Membership[0].company;
    }
    return null;
  }, [applicationUser]);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(firebaseClientAuth);
      router.replace("/");
    } catch (error) {
      console.error(error);
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut) return <CircularProgress />;

  const showSkeleton = !authToken || isLoading;

  const panels = [
    // 0: Properties
    <>
      <p className={"font-bold text-4xl mb-12"}>Properties</p>
      {(company || showSkeleton) && (
        <PropertiesTab
          company={company}
          userListings={(applicationUser?.Listing as Listing[] | undefined) || []}
          isLoading={showSkeleton}
        />
      )}
      {!company && !showSkeleton && (
        <ProfilePageOwnListings
          initialListings={(applicationUser?.Listing as Listing[] | undefined) || []}
        />
      )}
    </>,
    // 1: Saved
    <>
      <p className={"font-bold text-4xl mb-12"}>Saved items</p>
      <SavedItemsPageTabs />
    </>,
    // 2: Personal details
    <>
      <p className={"font-bold text-4xl mb-12"}>Personal details</p>
      <PersonalDetailsTab />
    </>,
    // 3: Company
    <>
      <p className={"font-bold text-4xl mb-12"}>Company</p>
      <CompanyTab />
    </>,
    // 4: Invites
    <>
      <p className={"font-bold text-4xl mb-12"}>Invites</p>
      <InvitesTab />
    </>,
    // 5: Recently viewed
    <>
      <p className={"font-bold text-4xl mb-12"}>Recently viewed</p>
      <RecentlyViewedListings />
    </>,
  ];

  return (
    <div>
      <div className={"flex flex-col md:flex-row min-h-screen pb-20"}>
        <div className="flex flex-col min-w-[300px] border-none md:border-r pt-12">
          <div className={"flex flex-col gap-2 w-fit mx-auto items-center mb-12"}>
            {showSkeleton ? (
              <>
                <Skeleton variant="text" width={130} height={26} />
                <Skeleton variant="text" width={180} height={22} />
              </>
            ) : error ? (
              <p className={"text-red-500 text-sm"}>Could not load profile</p>
            ) : (
              <>
                <div className={"font-bold"}>{applicationUser?.displayName}</div>
                <div className={"font-bold"}>{applicationUser?.email}</div>
              </>
            )}
          </div>
          <div className="">
            <div
              className="h-full mx-auto flex flex-row md:flex-col w-full overflow-x-auto overflow-y-hidden no-scrollbar gap-x-2 md:gap-x-0"
              role="tablist"
            >
              {TAB_LABELS.map((label, i) => {
                if (label === "Log out") {
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`${TAB_BASE} ${TAB_INACTIVE}`}
                      onClick={handleLogOut}
                    >
                      {label}
                    </button>
                  );
                }
                return (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={activeIndex === i}
                    className={`${TAB_BASE} ${activeIndex === i ? TAB_ACTIVE : TAB_INACTIVE}`}
                    onClick={() => setActiveIndex(i)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel */}
        <div className={"flex-1 min-w-0 pt-12 pl-1 md:pl-20"}>
          {panels[activeIndex] ?? null}
        </div>
      </div>
    </div>
  );
};
