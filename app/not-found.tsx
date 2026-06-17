import type { Metadata } from "next"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { ErrorPageShell } from "@/app/components/shared/ErrorPageShell"

export const metadata: Metadata = {
  title: "Page Not Found",
}

export default function NotFound() {
  return (
    <ErrorPageShell
      code="Error 404"
      icon={<MagnifyingGlassIcon className="h-10 w-10 text-[#1F5FD6]" />}
      title="Page not found"
      description="The page you're looking for doesn't exist or may have been moved. Let's get you back on track."
      actions={[
        { type: "link", href: "/", label: "Go to home page", variant: "primary" },
        {
          type: "link",
          href: "/listings",
          label: "Browse all properties",
          variant: "ghost",
        },
      ]}
    />
  )
}
