import type { ReactNode } from "react"
import Link from "next/link"

type Action =
  | { type: "link"; href: string; label: string; variant?: "primary" | "ghost" }
  | { type: "button"; onClick: () => void; label: string; variant?: "primary" | "ghost" }

type Props = {
  code: string
  icon: ReactNode
  title: string
  description: string
  actions: Action[]
  digest?: string
}

const actionClass = (variant: "primary" | "ghost" = "primary") =>
  variant === "primary"
    ? "inline-flex items-center justify-center rounded-xl bg-[#1F5FD6] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#184FB5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-2"
    : "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition hover:border-[#CFE0FF] hover:text-[#1F5FD6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F5FD6]/25 focus-visible:ring-offset-2"

export function ErrorPageShell({
  code,
  icon,
  title,
  description,
  actions,
  digest,
}: Props) {
  return (
    <div className="flex min-h-[68vh] items-center justify-center bg-[#F8FAFC] px-4 py-20">
      <div className="w-full max-w-md text-center">
        {/* Icon badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF2FF]">
          {icon}
        </div>

        {/* Code label */}
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#717D96]">
          {code}
        </p>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-[#2D3648]">{title}</h1>

        {/* Description */}
        <p className="mb-8 leading-relaxed text-[#717D96]">{description}</p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {actions.map((action, i) =>
            action.type === "link" ? (
              <Link
                key={i}
                href={action.href}
                className={actionClass(action.variant)}
              >
                {action.label}
              </Link>
            ) : (
              <button
                key={i}
                onClick={action.onClick}
                className={actionClass(action.variant)}
              >
                {action.label}
              </button>
            ),
          )}
        </div>

        {/* Debug digest */}
        {digest && (
          <p className="mt-8 font-mono text-[11px] text-slate-400">
            Error ID: {digest}
          </p>
        )}
      </div>
    </div>
  )
}
