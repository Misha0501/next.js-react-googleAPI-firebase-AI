"use client";

import { PlacingPropertyImagesHandler } from "@/app/components/PlacingPropertyImagesHandler";
import { useState } from "react";
import { ListingImage } from "@/types";

export default function ImagesHandlerPage() {
  const [images, setImages] = useState<ListingImage[]>([]);
  const handleImagesOnChange = (images: ListingImage[]) => {
    console.log("images");
    console.log(images);
  };

  return (
    <>
      <section className={"py-32"}>
        <div className="container">
          <PlacingPropertyImagesHandler
            onChange={handleImagesOnChange}
          ></PlacingPropertyImagesHandler>
        </div>
      </section>
    </>
  );
}
