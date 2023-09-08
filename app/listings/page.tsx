"use client";
import { ListingsMain } from "@/app/components/ListingsMain";
import { ListingsPageHeader } from "@/app/components/ListingsPageHeader";
import { ListingsPageFilters } from "@/app/components/ListingsPageFilters";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ListingsPageProps = {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Listings({}: ListingsPageProps) {
  const [searchParams, setSearchParams] = useState(null);
  const onParamsChange = useCallback((data) => {
    setSearchParams(data);
  }, []);

  return (
    <>
      <ListingsPageHeader></ListingsPageHeader>
      <section className={"text-black pb-16"}>
        <div className="container flex gap-x-24">
          <ListingsPageFilters onParamsChange={onParamsChange} />
          <ListingsMain
            searchParams={searchParams}
            className="w-full"
          ></ListingsMain>
        </div>
      </section>
    </>
  );
}
