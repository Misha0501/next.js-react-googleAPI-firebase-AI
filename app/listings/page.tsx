import { ListingsPageContent } from "@/app/components/ListingsPageContent";

type ListingsPageProps = {
  params?: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Listings({ searchParams, params }: ListingsPageProps) {
  return (
    <>
      <ListingsPageContent/>
    </>
  );
}
