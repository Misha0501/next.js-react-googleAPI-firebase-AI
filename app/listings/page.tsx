import { Suspense } from "react";
import { ListingsPageContent } from "@/app/components/listingsPage/ListingsPageContent";

export default function Listings() {
  return (
    <Suspense>
      <ListingsPageContent />
    </Suspense>
  );
}
