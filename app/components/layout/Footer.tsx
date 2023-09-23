import {Select, SelectItem} from "@tremor/react";
import Link from "next/link";

function Footer() {
  const availableLanguages = ["English", "French", "Italian", "Portuguese"];
  return (
    <footer className="bg-[#F5F5F9] px-16  py-10">
      <div className="flex justify-between gap-4 mb-16 container">
        <div>
          <p className="text-2xl font-bold text-[#2D3648]">Logo</p>
          <div className="flex flex-col gap-3">{/* <Icon icon={}/> */}</div>
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
      <div className="flex gap-6">
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
  );
}

export default Footer;
