import { HomeModernIcon } from "@heroicons/react/24/outline"
import { ErrorPageShell } from "@/app/components/shared/ErrorPageShell"

export default function ListingNotFound() {
  return (
    <ErrorPageShell
      code="Error 404"
      icon={<HomeModernIcon className="h-10 w-10 text-[#1F5FD6]" />}
      title="Property not found"
      description="This property listing doesn't exist, may have been removed, or is no longer active."
      actions={[
        {
          type: "link",
          href: "/listings",
          label: "Browse all properties",
          variant: "primary",
        },
        { type: "link", href: "/", label: "Go to home page", variant: "ghost" },
      ]}
    />
  )
}
