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
  const [localty, setLocalty] = useState(param.get("locality") || "");

  const onParamsChange = useCallback((data) => {
    setSearch(data);
  }, []);

  return (
    <>
      <ListingsPageHeader
        onLocaltyChange={(e) => setLocalty(e)}
      ></ListingsPageHeader>
      <section className={"text-black pb-16"}>
        <div className="container flex gap-x-24">
          <ListingsPageFilters
            listing={(e) => setListingType(e)}
            onParamsChange={onParamsChange}
          />
          <ListingsMain
            listingType={listingType}
            searchParams={search}
            localty={localty}
            className="w-full"
          ></ListingsMain>
        </div>
      </section>
    </>
  );
}
