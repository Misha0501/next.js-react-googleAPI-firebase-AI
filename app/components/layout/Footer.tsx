import { Select, SelectItem } from "@tremor/react";
import Link from "next/link";
import MobleFooter from "./MobileFooter";

function Footer() {
  const availableLanguages = ["English", "French", "Italian", "Portuguese"];
  return (
    <>
      <footer className="bg-[#F5F5F9] py-6 px-3 xl:px-16  xl:py-10 hidden md:block">
        <div className="flex justify-between gap-4 flex-col md:flex-row mb-16 container">
          <div>
            <p className="text-2xl font-bold text-[#2D3648] mb-5">Logo</p>
            <div className="flex flex-row gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 10 21"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.90464 7.61139H6.42565V5.07234C6.42565 4.29344 7.23131 4.11297 7.60748 4.11297H9.85474V0.686622L7.27907 0.672852C3.76492 0.672852 2.96268 3.22791 2.96268 4.86599V7.61139H0.412598V11.142H2.96268V20.6729H6.42565V11.142H9.36753L9.90464 7.61139Z"
                  fill="#222222"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 21"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M23.4985 3.07677C23.1136 3.30568 21.9587 3.7617 20.8814 3.87588C21.5721 3.47532 22.5949 2.1617 22.8472 1.11794C22.1832 1.57397 20.6582 2.23971 19.9053 2.23971L19.9067 2.24328C19.0468 1.27587 17.8388 0.672852 16.4965 0.672852C13.8934 0.672852 11.7815 2.94641 11.7815 5.751C11.7815 6.14029 11.8243 6.5183 11.9027 6.88237H11.9009C8.36873 6.78471 4.23924 4.87823 1.912 1.61459C0.483747 4.28012 1.71969 7.24375 3.34203 8.32367C2.78834 8.36988 1.76423 8.25526 1.28286 7.75168C1.24938 9.5191 2.04068 11.8633 4.92016 12.7126C4.3648 13.0352 3.38511 12.9428 2.95742 12.8717C3.10787 14.367 5.04962 16.3202 7.17151 16.3202C6.41559 17.2606 3.83466 18.9726 0.641113 18.4268C2.811 19.8502 5.34003 20.6729 8.01727 20.6729C15.6249 20.6729 21.5328 14.034 21.2149 5.84341C21.2149 5.83337 21.2119 5.82388 21.2119 5.81506C21.2119 5.79285 21.2149 5.77064 21.2149 5.751C21.2149 5.72622 21.2119 5.70089 21.2119 5.67433C21.9042 5.1664 22.8332 4.26528 23.4985 3.07677Z"
                  fill="#222222"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.9432 1.05957H6.32888C3.40324 1.05957 1.02344 3.43951 1.02344 6.36515V14.9793C1.02344 17.905 3.40324 20.2848 6.32888 20.2848H14.9432C17.8688 20.2848 20.2486 17.9044 20.2486 14.9793V6.36515C20.2486 3.43951 17.8688 1.05957 14.9432 1.05957ZM18.5429 14.9793C18.5429 16.9644 16.9282 18.579 14.9432 18.579H6.32888C4.34381 18.579 2.72918 16.9644 2.72918 14.9793V6.36515C2.72918 4.38008 4.34381 2.76531 6.32888 2.76531H14.9432C16.9282 2.76531 18.5429 4.38008 18.5429 6.36515V14.9793Z"
                  fill="#222222"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.6357 5.71973C7.9038 5.71973 5.68164 7.94189 5.68164 10.6731C5.68164 13.405 7.9038 15.6271 10.6357 15.6271C13.367 15.6271 15.5898 13.405 15.5898 10.6731C15.5898 7.94189 13.367 5.71973 10.6357 5.71973ZM10.6357 13.9208C8.84495 13.9208 7.38739 12.4644 7.38739 10.6731C7.38739 8.88247 8.84438 7.42491 10.6357 7.42491C12.427 7.42491 13.884 8.88247 13.884 10.6731C13.884 12.4644 12.4265 13.9208 10.6357 13.9208Z"
                  fill="#222222"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.797 4.27246C15.4682 4.27246 15.1455 4.40522 14.9135 4.63834C14.6797 4.87046 14.5459 5.19356 14.5459 5.52348C14.5459 5.85212 14.6803 6.17479 14.9135 6.40791C15.1451 6.64003 15.4682 6.77393 15.797 6.77393C16.1267 6.77393 16.4483 6.64003 16.6814 6.40791C16.9146 6.17479 17.0478 5.85155 17.0478 5.52348C17.0478 5.19356 16.9146 4.87046 16.6814 4.63834C16.4493 4.40522 16.1267 4.27246 15.797 4.27246Z"
                  fill="#222222"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={"#"} className="font-bold text-base text-[#292932]">
              Find Property
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Properties in Sofia
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Properties in Varna
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Properties in Plovdiv
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Properties in Burgas
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={"#"} className="font-bold text-base text-[#292932]">
              Resources
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Property Podcasts
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              How to buy guide
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={"#"} className="font-bold text-base text-[#292932]">
              Get help
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Estate agent FAQs
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Visitor FAQs
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Get in touch
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              Work with us
            </Link>
            <Link href={"#"} className="font-normal text-base text-[#292932]">
              About us
            </Link>
          </div>

          {/*<div className="col-span-2">*/}
          {/*  <Select defaultValue="English">*/}
          {/*    {availableLanguages.map((lang, key) => (*/}
          {/*      <SelectItem key={key} value={lang}>*/}
          {/*        {lang}*/}
          {/*      </SelectItem>*/}
          {/*    ))}*/}
          {/*  </Select>*/}
          {/*</div>*/}
        </div>
        <div className="flex justify-center md:justify-start gap-6">
          <Link href={"#"} className="text-[#717D96] text-sm font-semibold">
            © Company, 2023
          </Link>
          <Link href={"#"} className="text-[#2D3648] text-xs font-normal">
            Terms
          </Link>
          <Link href={"#"} className="text-[#2D3648] text-xs font-normal">
            Privacy
          </Link>
          <Link href={"#"} className="text-[#2D3648] text-xs font-normal">
            Cookies
          </Link>
        </div>
      </footer>
      <MobleFooter />
    </>
  );
}

export default Footer;
