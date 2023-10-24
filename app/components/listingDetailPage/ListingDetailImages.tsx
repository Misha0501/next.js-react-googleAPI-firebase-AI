import { useMemo } from "react";
import { ListingImage } from "@/types";
import Image from "next/image";
import { Button } from "@tremor/react";
import { PhotoIcon } from "@heroicons/react/24/outline";

type Props = {
  images: ListingImage[];
  handleOpenLightBox: (index: number) => void;
};
export const ListingDetailImages = ({
  images,
  handleOpenLightBox,
}: Props) => {
  const listingImagesAmount = useMemo(() => images.length, [images]);

  return (
    <div className="relative">
      <div
        className={`grid grid-cols-1 lg:${
          listingImagesAmount === 1
            ? "grid-cols-1"
            : listingImagesAmount === 2
              ? "grid-cols-2"
              : "grid-cols-3"
        } gap-0 lg:gap-4`}
      >
        {images[0]?.url && (
          <div
            onClick={() => handleOpenLightBox(0)}
            className={`${
              listingImagesAmount === 1 || listingImagesAmount === 2
                ? "col-span-1"
                : "col-span-2"
            }`}
          >
            <Image
              className={
                "cursor-pointer object-cover h-full lg:h-full lg:max-h-[680px] w-full lg:rounded-lg"
              }
              height={680}
              width={1500}
              sizes="100vw"
              src={images[0]?.url}
              alt="property"
            />
          </div>
        )}
        {listingImagesAmount === 2 && images[1]?.url && (
          <div
            className="hidden lg:block"
            onClick={() => handleOpenLightBox(1)}
          >
            <Image
              className={
                "cursor-pointer object-cover w-full rounded-lg h-full"
              }
              height={600}
              width={480}
              src={images[1]?.url}
              alt="property"
            />
          </div>
        )}
        {listingImagesAmount > 2 && (
          <div className={"flex flex-col gap-4"}>
            {images[1]?.url && (
              <div
                className="hidden lg:block h-full"
                onClick={() => handleOpenLightBox(1)}
              >
                <Image
                  className={
                    "cursor-pointer object-cover w-full rounded-lg h-full"
                  }
                  height={322}
                  width={492}
                  src={images[1]?.url}
                  alt="property"
                />
              </div>
            )}
            {images[2]?.url && (
              <div
                className="hidden lg:block h-full"
                onClick={() => handleOpenLightBox(2)}
              >
                <Image
                  className={
                    "cursor-pointer object-cover w-full rounded-lg h-full"
                  }
                  height={322}
                  width={492}
                  src={images[2]?.url}
                  alt="property"
                  // placeholder="blur" // Optional blur-up while loading
                />
              </div>
            )}
          </div>
        )}
      </div>
      {images[2]?.url && (
        <Button
          onClick={() => handleOpenLightBox(1)}
          className="absolute bottom-6 right-6 hidden lg:flex"
          icon={PhotoIcon}
        >
          View all photos
        </Button>
      )}
    </div>
  );
};

