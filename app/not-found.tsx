import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="py-32 text-center">
        <h2 className="mb-8 text-2xl">
          Oops we could not find the page you are looking for...
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#1F5FD6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5]"
          >
            Go to home page
          </Link>
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-xl bg-[#1F5FD6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5]"
          >
            View all properties
          </Link>
        </div>
      </div>
    </div>
  );
}
