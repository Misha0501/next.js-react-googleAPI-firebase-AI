import {
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@tremor/react";

export const FloatingContactWidget = ({}) => {
  return (
    <div className="h-20 w-full fixed bottom-[68px] left-0 bg-white shadow-inner border-t-2  flex items-center justify-around px-4 md:hidden">
      <Button variant="secondary" icon={PhoneIcon} className="px-7 h-12">
        Call
      </Button>
      <Button
        variant="primary"
        icon={ChatBubbleLeftRightIcon}
        className="px-9 h-12"
      >
        Contact Agent
      </Button>
    </div>
  );
};

export default FloatingContactWidget;
