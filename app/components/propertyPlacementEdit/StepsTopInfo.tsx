import React from "react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image, { StaticImageData } from "next/image";

interface StepsTopInfoProps {
  stepNumber?: string;
  title?: string;
  description?: string;
  imageSrc?: StaticImageData;
  onClick?: () => void;
  handleBack?: () => void;
  step?: number;
}

const StepsTopInfo: React.FC<StepsTopInfoProps> = ({
  stepNumber,
  title,
  description,
  imageSrc,
  step,
  onClick,
  handleBack,
}) => {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
            <p className="mb-5 inline-flex w-fit rounded-full border border-[#CFE0FF] bg-[#EAF2FF] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1F5FD6]">
              {stepNumber}
            </p>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-[#1F2937] md:text-5xl">
              {title}
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-[#596579] md:text-base">
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#334155] transition hover:border-[#1F5FD6] hover:text-[#1F5FD6] sm:w-auto"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onClick}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1F5FD6] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#184FB5] sm:w-auto"
              >
                Start this step
                <ArrowSmallRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative min-h-[260px] border-t border-slate-200 bg-slate-100 lg:border-l lg:border-t-0">
            {imageSrc && (
              <Image
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={imageSrc}
                alt="Property"
                placeholder="blur"
                priority={step === 0}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsTopInfo;
