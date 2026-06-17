"use client"

import { useEffect } from "react"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { ErrorPageShell } from "@/app/components/shared/ErrorPageShell"

type Props = {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function RootError({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorPageShell
      code="Error 500"
      icon={<ExclamationCircleIcon className="h-10 w-10 text-[#1F5FD6]" />}
      title="Something went wrong"
      description="An unexpected error occurred. This is on us — please try again or head back to the home page."
      actions={[
        {
          type: "button",
          onClick: unstable_retry,
          label: "Try again",
          variant: "primary",
        },
        { type: "link", href: "/", label: "Go to home page", variant: "ghost" },
      ]}
      digest={error.digest}
    />
  )
}
