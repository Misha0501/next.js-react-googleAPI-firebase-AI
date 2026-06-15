"use client";

import { useMemo, useState } from "react";
import { ListingImage } from "@/types";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { PhotosIcon, VerticaleMap } from "@/app/components/ui/Icons";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Props = {
  images: ListingImage[];
};

export const ListingDetailImages = ({ images }: Props) => {
  const listingImagesAmount = useMemo(() => images?.length ?? 0, [images]);
  const lightboxSlides = images?.map((item) => ({ src: item.url })) ?? [];
  const [openLightBox, setOpenLightBox] = useState(false);
  const [lightBoxImageIndex, setLightBoxImageIndex] = useState(0);

  const handleOpenLightBox = (index: number) => {
    setLightBoxImageIndex(index);
    setOpenLightBox(true);
  };

  if (!images?.length) {
    return (
      <div className="flex h-[56vw] min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm lg:h-[460px]">
        <div className="flex max-w-xs flex-col items-center px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FF]">
            <PhotoIcon className="h-7 w-7 text-[#1F5FD6]" />
          </div>
          <p className="text-base font-semibold text-[#2D3648]">
            Photos coming soon
          </p>
          <p className="mt-1 text-sm text-[#717D96]">
            The seller has not uploaded property images yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        plugins={[Thumbnails]}
        slides={lightboxSlides}
        index={lightBoxImageIndex}
      />

      {/* Desktop grid */}
      <div className="relative hidden h-[460px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] lg:block">
        <div
          className={`grid h-full gap-1.5 ${
            listingImagesAmount === 1
              ? "grid-cols-1"
              : listingImagesAmount === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {/* Main image */}
          {images[0]?.url && (
            <div
              onClick={() => handleOpenLightBox(0)}
              className={`group overflow-hidden rounded-xl cursor-pointer ${
                listingImagesAmount > 2 ? "col-span-2" : "col-span-1"
              }`}
            >
              <Image
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                height={680}
                width={1500}
                sizes="(max-width: 1024px) 100vw, 66vw"
                src={images[0].url}
                alt="property"
              />
            </div>
          )}

          {/* 2-image layout: second image beside main */}
          {listingImagesAmount === 2 && images[1]?.url && (
            <div
              className="group overflow-hidden rounded-xl cursor-pointer"
              onClick={() => handleOpenLightBox(1)}
            >
              <Image
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                height={600}
                width={480}
                src={images[1].url}
                alt="property"
              />
            </div>
          )}

          {/* 3+ image layout: right column with 2 stacked images */}
          {listingImagesAmount > 2 && (
            <div className="grid h-full min-h-0 grid-rows-2 gap-1.5">
              {images[1]?.url && (
                <div
                  className="group min-h-0 overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => handleOpenLightBox(1)}
                >
                  <Image
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    height={322}
                    width={492}
                    src={images[1].url}
                    alt="property"
                  />
                </div>
              )}
              {images[2]?.url && (
                <div
                  className="group min-h-0 overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => handleOpenLightBox(2)}
                >
                  <Image
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    height={322}
                    width={492}
                    src={images[2].url}
                    alt="property"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {images[2]?.url && (
          <button
            onClick={() => handleOpenLightBox(1)}
            className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white px-4 py-2 text-sm font-semibold text-[#2D3648] shadow-lg transition hover:bg-slate-50"
            data-testid="viewAllPhotos"
          >
            <PhotoIcon className="h-4 w-4" />
            View all photos
          </button>
        )}
      </div>

      {/* Mobile: single hero image */}
      <div className="block lg:hidden">
        {images[0]?.url && (
          <div
            className="h-[56vw] min-h-[220px] max-h-[360px] overflow-hidden rounded-t-2xl border border-b-0 border-slate-200 bg-white cursor-pointer shadow-sm"
            onClick={() => handleOpenLightBox(0)}
          >
            <Image
              className="h-full w-full object-cover"
              height={500}
              width={800}
              sizes="100vw"
              src={images[0].url}
              alt="property"
            />
          </div>
        )}
        <div className="rounded-b-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-slate-200 py-2">
            <button
              onClick={() => setOpenLightBox(true)}
              className="flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-[#1F5FD6] transition hover:bg-[#EAF2FF]"
            >
              <PhotosIcon className="h-4 w-4" />
              Photos
            </button>
            <Link
              href="#mapSection"
              className="flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-[#1F5FD6] transition hover:bg-[#EAF2FF]"
            >
              <VerticaleMap className="h-4 w-4" />
              Location
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
