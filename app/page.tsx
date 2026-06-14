import headerImg from "@/public/header-hero.jpg";
import Image from "next/image";
import { HomeHeroHeaderSearch } from "@/app/components/homePage/HomeHeroHeaderSearch";
import HomeWebsiteInfoSection from "@/app/components/homePage/WebsiteInfoSectionHome";
import ExploreHomeSection from "@/app/components/homePage/ExploreHomeSection";
import RecentlyPlacedPropertiesSection from "@/app/components/homePage/RecentlyPlacedPropertiesSection";
import HomeSearchCollectionsSection from "@/app/components/homePage/HomeSearchCollectionsSection";
import HomeOwnerConfidenceSection from "@/app/components/homePage/HomeOwnerConfidenceSection";

export default function Home() {
  return (
    <div className="bg-white">
      <header
        className={
          "hero min-h-[680px] lg:min-h-[720px] bg-black relative flex justify-center items-center pt-28 pb-20 text-white"
        }
      >
        <div className="container z-10 px-4 sm:px-6 lg:px-8">
          <div className="hero__inner text-center">
            <h1 className={"mb-6 lg:mb-16"}>Find your future home with ease</h1>
            <HomeHeroHeaderSearch></HomeHeroHeaderSearch>
          </div>
        </div>
        <div className={"hero__img absolute inset-0 opacity-60"}>
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
      <HomeSearchCollectionsSection />
      <RecentlyPlacedPropertiesSection />
      <HomeOwnerConfidenceSection />
      <ExploreHomeSection />
    </div>
  );
}
