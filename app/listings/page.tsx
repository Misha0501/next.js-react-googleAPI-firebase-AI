"use client";
import { ListingsMain } from "@/app/components/ListingsMain";
import { ListingsPageHeader } from "@/app/components/ListingsPageHeader";
import { ListingsPageFilters } from "@/app/components/ListingsPageFilters";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type ListingsPageProps = {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Listings({ searchParams, params }: ListingsPageProps) {
  const param = useSearchParams();
  const [search, setSearch] = useState(null);
  const [listingType, setListingType] = useState(undefined);
  const [locality, setLocality] = useState(param.get("locality") || "");

  const onParamsChange = useCallback((data) => {
    setSearch(data);
  }, []);

  const handleSelectedLocalityChange = (locality: string) => {
    console.log("locality");
    console.log(locality);

    setLocality(locality);
  }

  return (
    <>
      <ListingsPageHeader
        onLocalityChange={handleSelectedLocalityChange}
        initialLocality={locality}
      />
      <section className={"text-black pb-16"}>
        <div className="container flex gap-x-24">
          <ListingsPageFilters
            listing={(e) => setListingType(e)}
            onParamsChange={onParamsChange}
          />
          <ListingsMain
            listingType={listingType}
            searchParams={search}
            locality={locality}
            className="w-full"
          ></ListingsMain>
        </div>
      </section>
    </>
  );
}
