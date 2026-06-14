import Image from "next/image";
import Link from "next/link";
import logo from "@/public/homfli-logo.svg";
import {
  ArrowUpRightIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const propertyLinks = [
  { label: "Buy property", href: "/listings?listingType=SELL" },
  { label: "Rent property", href: "/listings?listingType=RENT" },
  { label: "Recently placed", href: "/listings?sortBy=createdAtDesc" },
  { label: "Saved properties", href: "/profile/saved" },
  { label: "Place your property", href: "/placeproperties" },
];

const cityLinks = [
  { label: "Sofia", href: "/listings?locality=Sofia&listingType=SELL" },
  { label: "Plovdiv", href: "/listings?locality=Plovdiv&listingType=SELL" },
  { label: "Varna", href: "/listings?locality=Varna&listingType=SELL" },
  { label: "Burgas", href: "/listings?locality=Burgas&listingType=SELL" },
  { label: "Byala", href: "/listings?locality=Byala&listingType=SELL" },
];

const accountLinks = [
  { label: "Sign in", href: "/signin" },
  { label: "My properties", href: "/profile/myProperties" },
  { label: "Saved searches", href: "/profile/saved?view=searches" },
  { label: "Contact", href: "/contact" },
];

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link
      href={href}
      className="text-sm text-slate-300 hover:text-white transition-colors"
    >
      {label}
    </Link>
  </li>
);

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] text-white border-t border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-40 lg:pb-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_2fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center mb-5">
              <Image
                className="h-5 w-auto bg-white rounded-md px-3 py-2 box-content"
                width={112}
                height={19}
                src={logo}
                alt="Homfli logo"
              />
            </Link>
            <p className="text-slate-300 leading-7">
              A focused real estate marketplace for finding, saving, and placing
              properties across Bulgaria.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-[#97B6FF]" />
                <span>Sofia, Bulgaria</span>
              </div>
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-[#97B6FF]" />
                <Link href="/contact" className="hover:text-white">
                  Contact our team
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-[#97B6FF]" />
                <span>Agent-backed property support</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                <BuildingOffice2Icon className="h-5 w-5 text-[#97B6FF]" />
                Properties
              </h3>
              <ul className="space-y-3">
                {propertyLinks.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
                Popular cities
              </h3>
              <ul className="space-y-3">
                {cityLinks.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
                Account
              </h3>
              <ul className="space-y-3">
                {accountLinks.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-700 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} Real Estate Marketplace. All rights reserved.</p>
          <Link
            href="#main-navigation"
            className="inline-flex items-center gap-2 font-semibold text-slate-300 hover:text-white"
          >
            Back to top
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
