import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingsPageContent } from "@/app/components/listingsPage/ListingsPageContent";

export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Bulgaria",
  description:
    "Search verified listings — apartments, houses, land, and commercial property across Bulgaria. Filter by city, price, size, and more.",
};

const Listings = () => {
  return (
    <Suspense>
      <ListingsPageContent />
    </Suspense>
  );
};

export default Listings;
