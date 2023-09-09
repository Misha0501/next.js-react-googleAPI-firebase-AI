import Link from "next/link";

export const revalidate = 300;

type Props = {
  params: {
    id: string;
  };
};

async function ListingPage({ params: { id } }: Props) {
  return (
    <div className="py-32 flex flex-col max-w-xl justify-center items-center mx-auto">
      <h3 className={"text-4xl font-bold max-w-xl mb-12 text-center"}>
        Congratulations your listing is successfully published!
      </h3>

      <Link
        href={`/listings/${id}`}
        className={
          "tremor-Button-root flex-shrink-0 inline-flex justify-center items-center group font-medium outline-none rounded-tremor-default shadow-tremor-input dark:shadow-dark-tremor-input border px-4 py-2 text-sm text-tremor-brand dark:text-dark-tremor-brand bg-transparent border-tremor-brand dark:border-dark-tremor-brand hover:text-tremor-brand-emphasis dark:hover:text-dark-tremor-brand-emphasis hover:bg-tremor-brand-faint dark:hover:bg-dark-tremor-brand-faint"
        }
      >
        View listing
      </Link>
    </div>
  );
}

export default ListingPage;
