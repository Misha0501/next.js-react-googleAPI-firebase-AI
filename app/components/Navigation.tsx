import logo from "@/public/BoraLogo.png";
import Link from "next/link";
import Image from 'next/image'
import {Button} from "@tremor/react";

export const Navigation = () => {
    return (
        <nav className={"py-4 border-2"}>
            <div className="container flex justify-between">
                <Link href="/">
                    <Image
                        className={"w-24"}
                        width={60}
                        height={35}
                        src={logo}
                        alt="Company logo"
                        placeholder="blur" // Optional blur-up while loading
                    />
                </Link>
                <div className={"flex gap-x-3"}>
                    <Link href="/placeProperty"><Button variant="secondary">Place your property</Button></Link>
                    <Link href="/signin"><Button>Sign in</Button></Link>
                </div>
            </div>
        </nav>
    );
}
