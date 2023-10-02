"use client";
// import headerImg from '@/public/header-hero.jpg'
import headerImg from "@/public/header-hero.jpg";
import Image from "next/image";
import { HomeHeroHeaderSearch } from "@/app/components/HomeHeroHeaderSearch";
import HomeWebsiteInfoSection from "./components/HomePage/WebsiteInfoSectionHome";
import ExploreHomeSection from "./components/HomePage/ExploreHomeSection";
import NewestRentalSection from "./components/HomePage/NewestRentalSection";
import { useState } from "react";

export default function Home() {
  const [listingTypeSelected, setListingTypeSelected] = useState("SELL");
  return (
    <div>
      <header
        className={
          "hero min-h-[500px] overflow-hidden bg-black relative flex justify-center items-center py-16 lg:py-24 text-white"
        }
      >
        <div className="container z-10 text-center">
          <HomeHeroHeaderSearch
            setListingType={(e) => setListingTypeSelected(e)}
          />
        </div>
        <div className={"hero__img absolute inset-0 opacity-90"}>
          <Image
            className={"h-full w-full object-cover"}
            width={1500}
            height={1500}
            src={headerImg}
            alt="Picture of the author"
            placeholder="blur" // Optional blur-up while loading
          />
        </div>
      </header>
      <HomeWebsiteInfoSection />
      <ExploreHomeSection listingTypeSelected={listingTypeSelected} />
      {/*<NewestRentalSection />*/}
    </div>
  );
}
