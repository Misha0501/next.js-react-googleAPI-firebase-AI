"use client";

import logo from "@/public/homfli-logo.svg";
import Link from "next/link";
import Image from "next/image";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { Disclosure } from "@headlessui/react";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  BuildingOffice2Icon,
  HeartIcon,
  HomeModernIcon,
  ListBulletIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigationItems = [
  {
    label: "Home",
    href: "/",
    icon: HomeModernIcon,
  },
  {
    label: "Listings",
    href: "/listings",
    icon: ListBulletIcon,
  },
  {
    label: "Saved",
    href: "/profile/saved",
    icon: HeartIcon,
  },
];

const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getUserInitials = (user?: User | null) => {
  const source = user?.displayName || user?.email || "";
  const parts = source.split(/[.\s@_-]+/).filter(Boolean);

  if (!parts.length) return "HF";

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export const Navigation = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseClientAuth, async (user) => {
      setUser(user || null);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const userInitials = useMemo(() => getUserInitials(user), [user]);

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const authAction = user
    ? {
        label: "Profile",
        href: "/profile/myProperties",
        icon: UserCircleIcon,
      }
    : {
        label: "Sign in",
        href: "/signin",
        icon: UserCircleIcon,
      };

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur"
      id="main-navigation"
    >
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-[76px] items-center justify-between gap-4">
              <Link
                href="/"
                className="flex shrink-0 items-center rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-4"
                aria-label="Homfli home"
              >
                <Image
                  className="h-7 w-auto"
                  width={152}
                  height={26}
                  src={logo}
                  alt="Homfli logo"
                  priority
                />
              </Link>

              <div className="hidden items-center gap-1 lg:flex">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={classNames(
                        "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition",
                        isActive
                          ? "bg-[#EAF2FF] text-[#1F5FD6]"
                          : "text-[#4A5468] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  href="/placeproperties"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-4"
                >
                  <BuildingOffice2Icon className="h-4 w-4" />
                  Place property
                </Link>

                {isAuthReady ? (
                  <Link
                    href={authAction.href}
                    className={classNames(
                      "inline-flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-4",
                      isActiveRoute(authAction.href)
                        ? "border-[#CFE0FF] bg-[#F6F9FF] text-[#1F5FD6]"
                        : "border-slate-200 bg-white text-[#334155] hover:border-[#CFE0FF] hover:text-[#1F5FD6]",
                    )}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF2FF] text-xs font-black text-[#1F5FD6]">
                      {user ? (
                        userInitials
                      ) : (
                        <UserCircleIcon className="h-5 w-5" />
                      )}
                    </span>
                    <span>{authAction.label}</span>
                  </Link>
                ) : (
                  <div className="h-11 w-28 animate-pulse rounded-xl bg-slate-100" />
                )}
              </div>

              <div className="flex items-center gap-3 lg:hidden">
                <Link
                  href="/placeproperties"
                  className="hidden min-h-10 items-center justify-center rounded-xl bg-[#1F5FD6] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#184FB5] sm:inline-flex"
                >
                  Place property
                </Link>
                <Disclosure.Button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#334155] transition hover:border-[#CFE0FF] hover:text-[#1F5FD6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="border-t border-slate-200 bg-white lg:hidden">
            <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6">
              <div className="grid gap-2">
                {[...navigationItems, authAction].map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => close()}
                      className={classNames(
                        "flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition",
                        isActive
                          ? "bg-[#EAF2FF] text-[#1F5FD6]"
                          : "text-[#334155] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/placeproperties"
                  onClick={() => close()}
                  className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5]"
                >
                  <BuildingOffice2Icon className="h-5 w-5" />
                  Place property
                </Link>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
