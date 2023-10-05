import headerImg from "@/public/header-hero.jpg";
import Image from "next/image";
import { HomeHeroHeaderSearch } from "@/app/components/HomeHeroHeaderSearch";
import HomeWebsiteInfoSection from "@/app/components/homePage/WebsiteInfoSectionHome";
import ExploreHomeSection from "@/app/components/homePage/ExploreHomeSection";

export default function Home() {
  return (
    <div>
      <header className={'hero min-h-[700px] bg-black relative flex justify-center items-center pt-24 pb-16 text-white'}>
        <div className="container z-10">
          <div className="hero__inner text-center">
            <h1 className={"mb-6 lg:mb-16"}>Find your future home with ease</h1>
            <HomeHeroHeaderSearch></HomeHeroHeaderSearch>
          </div>
        </div>
        <div className={'hero__img absolute inset-0 opacity-60'}>
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
      <ExploreHomeSection/>
      {/*<NewestRentalSection />*/}
    </div>
  );
}
