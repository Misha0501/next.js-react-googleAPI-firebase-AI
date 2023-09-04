"use client"
import {ListingsMain} from "@/app/components/ListingsMain";
import {ListingsPageHeader} from "@/app/components/ListingsPageHeader";
import {ListingsPageFilters} from "@/app/components/ListingsPageFilters";
import {useRouter} from "next/navigation";
import {useEffect} from "react";


type ListingsPageProps = {
    params?: { slug: string; }
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Listings({searchParams}: ListingsPageProps) {
    const router = useRouter();
    useEffect(() => {
        console.log("RouterRouterRouterRouter")
    }, [router])
    return (
        <>
            <ListingsPageHeader></ListingsPageHeader>
            <section className={"text-black pb-16"}>
                <div className="container flex gap-x-24">
                    <ListingsPageFilters/>
                    <ListingsMain className="w-full"></ListingsMain>
                </div>
            </section>
        </>
    );
}

