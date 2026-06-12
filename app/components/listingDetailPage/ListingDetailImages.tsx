"use client";

import { useMemo, useState } from "react";
import { ListingImage } from "@/types";
import Image from "next/image";
import { Button } from "@tremor/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { PhotosIcon, VerticaleMap } from "@/public/Icons";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Props = {
  images: ListingImage[];
};

export const ListingDetailImages = ({ images }: Props) => {
  const listingImagesAmount = useMemo(() => images?.length, [images]);
  const lightboxSlides = images?.map((item) => ({ src: item.url }));
  const [openLightBox, setOpenLightBox] = useState(false);
  const [lightBoxImageIndex, setLightBoxImageIndex] = useState(0);

  const handleOpenLightBox = (index: number) => {
    setLightBoxImageIndex(index);
    setOpenLightBox(true);
  };

  if (!images?.length) return null;

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
      <div className="relative hidden lg:block h-[420px] overflow-hidden rounded-xl">
        <div
          className={`h-full grid gap-2 ${
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
              className={`overflow-hidden rounded-lg cursor-pointer ${
                listingImagesAmount > 2 ? "col-span-2" : "col-span-1"
              }`}
            >
              <Image
                className="object-cover w-full h-full"
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
              className="overflow-hidden rounded-lg cursor-pointer"
              onClick={() => handleOpenLightBox(1)}
            >
              <Image
                className="object-cover w-full h-full"
                height={600}
                width={480}
                src={images[1].url}
                alt="property"
              />
            </div>
          )}

          {/* 3+ image layout: right column with 2 stacked images */}
          {listingImagesAmount > 2 && (
            <div className="grid grid-rows-2 gap-2 h-full min-h-0">
              {images[1]?.url && (
                <div
                  className="overflow-hidden rounded-lg cursor-pointer min-h-0"
                  onClick={() => handleOpenLightBox(1)}
                >
                  <Image
                    className="object-cover w-full h-full"
                    height={322}
                    width={492}
                    src={images[1].url}
                    alt="property"
                  />
                </div>
              )}
              {images[2]?.url && (
                <div
                  className="overflow-hidden rounded-lg cursor-pointer min-h-0"
                  onClick={() => handleOpenLightBox(2)}
                >
                  <Image
                    className="object-cover w-full h-full"
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
          <Button
            onClick={() => handleOpenLightBox(1)}
            className="absolute bottom-4 right-4"
            icon={PhotoIcon}
            data-testid="viewAllPhotos"
          >
            View all photos
          </Button>
        )}
      </div>

      {/* Mobile: single hero image */}
      <div className="block lg:hidden">
        {images[0]?.url && (
          <div
            className="h-[56vw] min-h-[220px] max-h-[340px] overflow-hidden cursor-pointer"
            onClick={() => handleOpenLightBox(0)}
          >
            <Image
              className="object-cover w-full h-full"
              height={500}
              width={800}
              sizes="100vw"
              src={images[0].url}
              alt="property"
            />
          </div>
        )}
        <div className="bg-[#F2F2F2] border-b border-[#ccc]">
          <div className="flex justify-around py-4">
            <Button
              icon={PhotosIcon}
              onClick={() => setOpenLightBox(true)}
              className="flex gap-1 p-0 bg-transparent border-0 text-tremor-brand-textPrimary font-bold hover:bg-transparent"
            >
              Photos
            </Button>
            <Link href="#mapSection">
              <Button
                icon={VerticaleMap}
                className="flex gap-1 p-0 bg-transparent border-0 text-tremor-brand-textPrimary font-bold hover:bg-transparent"
              >
                Location
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
