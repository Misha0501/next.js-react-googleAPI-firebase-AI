import HomeHero from "@/app/components/homePage/HomeHero";
import HomeWebsiteInfoSection from "@/app/components/homePage/WebsiteInfoSectionHome";
import ExploreHomeSection from "@/app/components/homePage/ExploreHomeSection";
import RecentlyPlacedPropertiesSection from "@/app/components/homePage/RecentlyPlacedPropertiesSection";
import HomeSearchCollectionsSection from "@/app/components/homePage/HomeSearchCollectionsSection";
import HomeOwnerConfidenceSection from "@/app/components/homePage/HomeOwnerConfidenceSection";

export default function Home() {
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
}
