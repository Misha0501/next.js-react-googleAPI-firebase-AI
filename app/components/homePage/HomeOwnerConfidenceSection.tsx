import Link from "next/link";
import {
  CameraIcon,
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const ownerBenefits = [
  {
    title: "Clear presentation",
    description: "Photos, pricing, location, and details stay structured.",
    icon: CameraIcon,
  },
  {
    title: "Better property quality",
    description: "Helpful prompts make the property easier to compare.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "Buyer-ready context",
    description: "Key facts are shown where people naturally scan first.",
    icon: ChartBarSquareIcon,
  },
  {
    title: "Support when needed",
    description: "Agent-backed help is available for important decisions.",
    icon: ShieldCheckIcon,
  },
];

const HomeOwnerConfidenceSection = () => {
  return (
    <section className="border-b border-slate-200/80 bg-[#F4F7FB] py-20 lg:py-24">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1F5FD6]">
            For owners
          </p>
          <h2 className="text-2xl font-bold text-[#222222] md:text-[40px] md:leading-tight">
            Place your property with a sharper first impression
          </h2>
          <p className="mt-4 max-w-xl text-[#717D96]">
            A stronger property presentation helps serious buyers and renters
            understand the home faster, compare it fairly, and take the next
            step with confidence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/placeproperties"
              className="inline-flex items-center justify-center rounded-lg bg-[#1F5FD6] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#174DB3]"
            >
              Place your property
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1F5FD6] hover:text-[#1F5FD6]"
            >
              Talk to an agent
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ownerBenefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-[#1F5FD6]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[#222222]">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#717D96]">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeOwnerConfidenceSection;
