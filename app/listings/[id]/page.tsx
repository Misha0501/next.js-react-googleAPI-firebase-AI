import ListingDetail from "@/app/components/listingDetailPage/ListingDetail";

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
