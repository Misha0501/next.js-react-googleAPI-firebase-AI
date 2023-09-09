"use client";
import logo from "@/public/BoraLogo.png";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@tremor/react";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { signOut } from "@firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const Navigation = () => {
  const [user, setUser] = useState();
  const handleSingOut = async () => {
    console.log("handle sign out");
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
          <Link href="/profile/saved"><Button variant="secondary">Saved properties</Button></Link>
          <Link href="/placeProperty"><Button variant="secondary">Place your property</Button></Link>
          {user && <Link href="/profile/myProperties"><Button>Profile</Button></Link>}
          {!user && <Link href="/signin"><Button>Sign in</Button></Link>}
        </div>
      </div>
    </nav>
  );
};
