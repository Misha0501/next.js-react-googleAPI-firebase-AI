import Image from "next/image";
import Link from "next/link";
import logo from "@/public/homfli-logo.svg";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { CookiePreferencesButton } from "@/app/components/layout/CookiePreferencesButton";

const exploreLinks = [
  { label: "Buy property", href: "/listings?listingType=SELL" },
  { label: "Rent property", href: "/listings?listingType=RENT" },
  { label: "New developments", href: "/listings?sortBy=createdAtDesc" },
  { label: "Saved properties", href: "/profile/saved" },
  { label: "Place your property", href: "/placeproperties" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link
      href={href}
      className="text-sm text-slate-300 transition-colors hover:text-white"
    >
      {label}
    </Link>
  </li>
);

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) => (
  <div>
    <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <FooterLink key={link.href} {...link} />
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-[#111827] text-white">
      <div className="mx-auto max-w-screen-xl px-4 pb-40 pt-14 sm:px-6 lg:px-8 lg:pb-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <Link href="/" className="mb-5 inline-flex items-center">
              <Image
                className="box-content h-5 w-auto rounded-md bg-white px-3 py-2"
                width={112}
                height={19}
                src={logo}
                alt="Homfli logo"
              />
            </Link>
            <p className="text-base font-semibold text-white">
              Real estate, simplified.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
              A focused real estate marketplace for buying, renting, and placing
              properties across Bulgaria.
            </p>
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
              <li>
                <CookiePreferencesButton />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-700 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© Homfli {currentYear}</p>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <span className="hidden text-slate-600 md:inline">·</span>
            <p>
              Built by{" "}
              <a
                href="https://mykhailogalenda.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-300 transition-colors hover:text-white"
              >
                Mykhailo Galenda
              </a>{" "}
              ·{" "}
              <a
                href="https://mykhailogalenda.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-300 transition-colors hover:text-white"
              >
                mykhailogalenda.com
              </a>
            </p>
          </div>
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
};

export default Footer;
