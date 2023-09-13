import { notFound } from "next/navigation";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  HeatingType,
  InteriorType,
  Listing,
  ListingType,
  UpkeepType,
} from "@/types";
import { getFetchUrl } from "@/app/lib/getFetchUrl";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Icon } from "@tremor/react";
import ListingDetail from "@/app/components/ListingDetail";

export const revalidate = 300;

type Props = {
  params: {
    id: string;
  };
};

async function ListingPage({ params: { id } }: Props) {
  return <ListingDetail />;
}

export default ListingPage;
