"use client";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
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
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-12 px-4 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-[#222222] font-bold text-2xl md:text-[40px]">
            Explore properties with us
          </h3>
          <p className="mx-auto max-w-2xl text-[#717D96]">
            Browse popular Bulgarian cities and discover listings in the places
            people search most.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {popularSearches.map((item, index) => (
            <div
              className="rounded-lg overflow-hidden relative w-full aspect-[4/3]"
              key={item.href}
            >
              <Image
                className="h-full w-full object-cover"
                width={420}
                height={315}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                src={item.img}
                alt={`${item.locality} properties`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-between bg-gradient-to-b from-black/35 via-black/10 to-black/45 px-4 py-8">
                <p className="text-white font-semibold text-xl drop-shadow-sm">
                  {item.locality}
                </p>
                <button
                  type="button"
                  onClick={() => router.push(item.href)}
                  className="group inline-flex max-w-full items-center justify-center gap-3 rounded-lg border border-white/70 bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.24)] backdrop-blur transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/90"
                >
                  View properties
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-slate-950 text-white transition-transform group-hover:translate-x-0.5">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreHomeSection;
