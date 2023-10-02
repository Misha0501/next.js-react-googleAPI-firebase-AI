"use client";
import logo from "@/public/BoraLogo.png";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@tremor/react";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export const Navigation = () => {
  const [user, setUser] = useState();

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
    <>
      <Disclosure as="nav" className="py-3 sm:py-4 duration-1000 border-b-2">
        {({ open, close }) => (
          <>
            <div className="container">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-shrink-0 items-center">
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
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      <Link href="/profile/saved">
                        <Button variant="secondary">Saved properties</Button>
                      </Link>
                      <Link href="/placeproperties">
                        <Button variant="secondary">Place your property</Button>
                      </Link>
                      {user && (
                        <Link href="/profile/myProperties">
                          <Button>Profile</Button>
                        </Link>
                      )}
                      {!user && (
                        <Link href="/signin">
                          <Button>Sign in</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative duration-700">
              <Disclosure.Panel className="absolute w-full p-2 top-0 left-0 z-40 bg-white duration-700 border-t-2 sm:hidden shadow-[0_35px_60px_-10px_rgba(167,165,165,0.3)] ">
                <div className="space-y-1 px-2 pb-3 pt-2 flex flex-col items-end gap-3">
                  <Link href="/profile/saved">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        close();
                      }}
                    >
                      Saved properties
                    </Button>
                  </Link>
                  <Link href="/placeproperties">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        close();
                      }}
                    >
                      Place your property
                    </Button>
                  </Link>
                  {user && (
                    <Link href="/profile/myProperties">
                      <Button
                        onClick={() => {
                          close();
                        }}
                      >
                        Profile
                      </Button>
                    </Link>
                  )}
                  {!user && (
                    <Link href="/signin">
                      <Button
                        onClick={() => {
                          close();
                        }}
                      >
                        Sign in
                      </Button>
                    </Link>
                  )}
                </div>
              </Disclosure.Panel>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
};
