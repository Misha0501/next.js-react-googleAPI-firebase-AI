import headerImg from "@/public/header-hero.jpg";
import Image from "next/image";
import { HomeHeroHeaderSearch } from "@/app/components/homePage/HomeHeroHeaderSearch";
import { CheckBadgeIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function HomeHero() {
  return (
    <header className="relative overflow-hidden bg-[#0B1220] text-white">
      <div className="absolute inset-0">
        <Image
          className="h-full w-full object-cover"
          width={1500}
          height={1500}
          src={headerImg}
          alt="Modern residential building in Bulgaria"
          placeholder="blur"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(8, 15, 28, 0.60)" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-start px-4 pb-20 pt-36 text-center sm:px-6 lg:px-8">
        <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl md:leading-[1.02]">
          Find your next home in Bulgaria.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/68 md:text-lg">
          Browse homes for sale and rent across Bulgarian cities with clear euro
          pricing and filters built for confident decisions.
        </p>

        <div className="mt-11 w-full max-w-2xl">
          <HomeHeroHeaderSearch />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-white/62">
          <span className="inline-flex items-center gap-2">
            <CheckBadgeIcon className="h-5 w-5 text-[#AFC7FF]" />
            Verified account flow
          </span>
          <span className="inline-flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-[#AFC7FF]" />
            Premium listing presentation
          </span>
        </div>
      </div>
    </header>
  );
}
