import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import whatsapp from "@/public/whatsapp.png";
import viber from "@/public/viber.png";
import Image from "next/image";
import { ContactForm } from "@/app/components/contactPage/ContactForm";

export default function ContactPage() {
  return (
    <div className={"py-12 md:py-32"}>
      <div className="container">
        <div className="flex flex-col gap-10 items-center justify-center md:flex-row md:gap-24">
          <div className="h-fit flex flex-col bg-blue-50 py-14 md:py-24 px-14 rounded-xl text-gray-600 md:max-w-md">
            <h1 className={"text-3xl mb-12 font-semibold text-gray-800"}>
              Contact Us
            </h1>
            <div className="flex flex-col gap-6">
              <div className="flex gap-6 items-center">
                <MapPinIcon className={"h-6 w-6"} />
                <span className={"w-fit"}>
                  1 Business Building Sofia Str., Mladost 4 district, 1766
                  Sofia, Bulgarije
                </span>
              </div>
              <a href={"mailto:misha.galenda@gmail.com?subject=RealEstate&body=Hello"} className="flex gap-6 items-center">
                <EnvelopeIcon className={"h-6 w-6"} />
                <span className={"w-fit"}>info@real-estate.bg</span>
              </a>
              <a href={"tel:+380965039622"} className="flex gap-6 items-center">
                <PhoneIcon className={"h-6 w-6"} />
                <span className={"w-fit"}>+31 6 33357777</span>
              </a>
              <a
                href="whatsapp://send?text=Hello World!&phone=+380965039622"
                className="flex gap-6 items-center"
              >
                <Image
                  className={"h-6 w-6"}
                  width={21}
                  height={21}
                  src={whatsapp}
                  alt="Whatsapp"
                  placeholder="blur" // Optional blur-up while loading
                />
                <span className={"w-fit"}>+31 6 33357777</span>
              </a>
              <a
                id="viber"
                href="viber://chat?number=+380965039622"
                className="flex gap-6 items-center"
              >
                <Image
                  className={"h-6 w-6"}
                  width={21}
                  height={21}
                  src={viber}
                  alt="Whatsapp"
                  placeholder="blur" // Optional blur-up while loading
                />
                <span className={"w-fit"}>+31 6 33357777</span>
              </a>
            </div>
          </div>
          <div className="flex flex-col rounded-xl max-w-2xl text-gray-600">
            <h1 className={"text-3xl mb-3 font-semibold text-gray-800"}>
              Get in touch
            </h1>
            <p className={"text-gray-500"}>
              Feel free to contact us if you have any troubles with the website,
              want to join the team, or have a proposition.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
