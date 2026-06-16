"use client";

import {
  BuildingOffice2Icon,
  HeartIcon,
  HomeModernIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

type MobileNavItem = {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  link: string;
  isPrimary?: boolean;
  match?: (pathname: string) => boolean;
};

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    title: "Home",
    icon: HomeModernIcon,
    link: "/",
    match: (pathname) => pathname === "/",
  },
  {
    title: "Properties",
    icon: ListBulletIcon,
    link: "/listings",
  },
  {
    title: "Place",
    icon: BuildingOffice2Icon,
    link: "/placeproperties",
    isPrimary: true,
  },
  {
    title: "Saved",
    icon: HeartIcon,
    link: "/profile/saved",
  },
  {
    title: "Profile",
    icon: UserCircleIcon,
    link: "/profile/myProperties",
    match: (pathname) =>
      pathname.startsWith("/profile") && !pathname.startsWith("/profile/saved"),
  },
];

const classNames = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const MobileFooter = () => {
  const pathname = usePathname() || "/";

  const isActiveRoute = (item: MobileNavItem) => {
    if (item.match) return item.match(pathname);
    if (item.link === "/") return pathname === "/";

    return pathname === item.link || pathname.startsWith(`${item.link}/`);
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 block border-t border-white/70 bg-white/90 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-18px_44px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1 rounded-[1.35rem] border border-slate-200 bg-white px-2 py-2 shadow-[0_8px_26px_rgba(15,23,42,0.08)]">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item);

          if (item.isPrimary) {
            return (
              <Link
                key={item.link}
                href={item.link}
                aria-current={isActive ? "page" : undefined}
                className="group -mt-7 flex min-w-0 flex-col items-center gap-1 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-4"
              >
                <span
                  className={classNames(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F5FD6] text-white shadow-[0_16px_32px_rgba(31,95,214,0.34)] transition duration-200 group-hover:-translate-y-0.5 group-hover:bg-[#184FB5]",
                    isActive && "ring-4 ring-[#EAF2FF]",
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span
                  className={classNames(
                    "truncate text-[11px] font-black leading-none transition",
                    isActive ? "text-[#1F5FD6]" : "text-[#475569]",
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.link}
              href={item.link}
              aria-current={isActive ? "page" : undefined}
              className={classNames(
                "flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-black leading-none outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-2",
                isActive
                  ? "bg-[#EAF2FF] text-[#1F5FD6] shadow-[inset_0_0_0_1px_rgba(31,95,214,0.08)]"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1F5FD6]",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="max-w-full truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileFooter;
