"use client"
import logo from "@/public/BoraLogo.png";
import Link from "next/link";
import Image from 'next/image'
import {Button} from "@tremor/react";
import {useAuthContext} from "@/app/context/AuthContext";
import {firebaseClientAuth} from "@/app/lib/firebase/configClient";
import {signOut} from "@firebase/auth";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {setCookie} from "cookies-next";

export const Navigation = () => {
    const [user, setUser] = useState()
    const handleSingOut = async () => {
        console.log("handle sign out")
        await signOut(firebaseClientAuth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseClientAuth, async (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

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
                    <Button onClick={handleSingOut}>Sign out</Button>
                    <Link href="/savedItems"><Button variant="secondary">Saved properties</Button></Link>
                    <Link href="/placeProperty"><Button variant="secondary">Place your property</Button></Link>
                    {user && <Button onClick={handleSingOut}>Sign out</Button>}
                    {!user && <Link href="/signin"><Button>Sign in</Button></Link>}
                </div>
            </div>
        </nav>
    );
}
