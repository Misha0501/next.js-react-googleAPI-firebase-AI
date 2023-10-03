import {
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";
import { Button } from "@tremor/react";

type Props = {
  phoneNumber: string;
  onContactClick: () => void;
};
export const FloatingContactWidget = ({
  phoneNumber,
  onContactClick,
}: Props) => {
  return (
    <div className="fixed bottom-[68px] left-0 right-0 bg-white border-t-2 lg:hidden shadow-2xl py-4">
      <div className="container flex items-center gap-4 justify-around">
        {phoneNumber && (
          <a href={`tel:${phoneNumber}`} className="w-1/2">
            <Button variant="secondary" icon={PhoneIcon} className={"w-full"}>
              Call
            </Button>
          </a>
        )}
        <Button
          variant="primary"
          icon={EnvelopeIcon}
          className="w-1/2"
          onClick={onContactClick}
        >
          Contact Seller
        </Button>
      </div>
    </div>
  );
};

export default FloatingContactWidget;
