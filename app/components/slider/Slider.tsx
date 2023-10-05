import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import { ListingItem } from "../ListingItem";

let populatedListings = [
  {
    active: true,
    id: 1,
    savedListingId: 11,
    currency: "EUR",
    price: 1322,
    areaTotal: 123,
    bedrooms: 10,
    Address: [{ locality: "Sofia" }],
    ListingImage: [
      {
        id: 111,
        url: "/property1.png",
      },
    ],
  },
  {
    active: true,
    id: 1,
    savedListingId: 11,
    currency: "EUR",
    price: 1322,
    areaTotal: 123,
    bedrooms: 10,
    Address: [{ locality: "Sofia" }],
    ListingImage: [
      {
        id: 111,
        url: "/property2.png",
      },
    ],
  },
  {
    active: true,
    id: 1,
    savedListingId: 11,
    currency: "EUR",
    price: 1322,
    areaTotal: 123,
    bedrooms: 10,
    Address: [{ locality: "Sofia" }],
    ListingImage: [
      {
        id: 111,
        url: "/property3.png",
      },
    ],
  },
  {
    active: true,
    id: 1,
    savedListingId: 11,
    currency: "EUR",
    price: 1322,
    areaTotal: 123,
    bedrooms: 10,
    Address: [{ locality: "Sofia" }],
    ListingImage: [
      {
        id: 111,
        url: "/property5.jpg",
      },
    ],
  },
  {
    active: true,
    id: 1,
    savedListingId: 11,
    currency: "EUR",
    price: 1322,
    areaTotal: 123,
    bedrooms: 10,
    Address: [{ locality: "Sofia" }],
    ListingImage: [
      {
        id: 111,
        url: "/property6.jpg",
      },
    ],
  },
];
const SlickSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    widthVariable: true,
    slidesToScroll: 1,
    centerMode: true,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const doNothing = () => {};
  return (
    <Slider {...settings}>
      {populatedListings &&
        populatedListings.map((item, index) => (
          <div key={index} className="pr-8">
            <ListingItem
              listingItemInitial={item}
              isLoading={false}
              onEditIconClick={doNothing}
              onDeleteIconClick={doNothing}
              ownerView={false}
            />
          </div>
        ))}
    </Slider>
  );
};
export default SlickSlider;
