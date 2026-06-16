import type { Metadata } from "next";
import HomeHero from "@/app/components/homePage/HomeHero";
import HomeWebsiteInfoSection from "@/app/components/homePage/WebsiteInfoSectionHome";
import ExploreHomeSection from "@/app/components/homePage/ExploreHomeSection";
import RecentlyPlacedPropertiesSection from "@/app/components/homePage/RecentlyPlacedPropertiesSection";
import HomeSearchCollectionsSection from "@/app/components/homePage/HomeSearchCollectionsSection";
import HomeOwnerConfidenceSection from "@/app/components/homePage/HomeOwnerConfidenceSection";

export const metadata: Metadata = {
  title: "Real Estate in Bulgaria",
  description:
    "Browse properties for sale and rent across Bulgaria. Find apartments, houses, and land in Sofia, Plovdiv, Varna, Burgas, and more.",
};

const Home = () => {
  return (
    <div className="bg-white">
      <HomeHero />
      <HomeWebsiteInfoSection />
      <HomeSearchCollectionsSection />
      <RecentlyPlacedPropertiesSection />
      <HomeOwnerConfidenceSection />
      <ExploreHomeSection />
    </div>
  );
};

export default Home;
