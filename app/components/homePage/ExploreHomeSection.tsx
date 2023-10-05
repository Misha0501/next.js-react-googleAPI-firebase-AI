"use client";
import { PlusSmallIcon } from "@heroicons/react/24/solid";
import { Button } from "@tremor/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ExploreHomeSection() {
  const router = useRouter();
  let popularSearches = [
    {
      locality: "Sofia",
      href: `listings?locality=Sofia&listingType=SELL`,
      img: "/e1.png",
    },
    {
      locality: "Plovdiv",
      href: `listings?locality=Plovdiv&listingType=SELL`,
      img: "/e3.jpg",
    },
    {
      locality: "Varna",
      href: `listings?locality=Varna&listingType=SELL`,
      img: "/e4.jpg",
    },
    {
      locality: "Byala",
      href: `listings?locality=Byala&listingType=SELL`,
      img: "/e2.jpg",
    },
  ];

  return (
    <section className="max-w-screen-xl m-auto flex flex-col text-center gap-12 px-4 md:px-0 py-20">
      <div className="flex flex-col gap-3">
        <h3 className="text-[#222222]  font-bold text-2xl md:text-[40px]">
          Explore properties with us
        </h3>
      </div>
      <div className="block md:flex gap-8 justify-between">
        {popularSearches.map((item, index) => (
          <div
            className="rounded-lg overflow-hidden relative w-full h-full md:h-[292px] md:w-[274px] mb-4 md:mb-0"
            key={item.href}
          >
            <Image
              className="w-full"
              width={0}
              height={0}
              sizes="100vw"
              src={item.img}
              alt={""}
            />
            <div className="conent absolute top-0 left-0 w-full h-full flex flex-col items-center justify-between py-10">
              <p className="text-white font-bold text-xl">{item.locality}</p>
              <Button
                onClick={() => router.push(item.href)}
                className="bg-[#97B6FF] border-0 text-white text-sm"
                icon={PlusSmallIcon}
              >
                View properties
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExploreHomeSection;
