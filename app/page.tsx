import Link from "next/link";

export default async function Home() {
    return (
        <>
            <div className="flex items-center justify-between font-sans text-sm flex-col">
                <Link href="/signin">Go to Login page</Link>
                <Link href="/server">Go to server page</Link>
            </div>
        </>
    )
}
