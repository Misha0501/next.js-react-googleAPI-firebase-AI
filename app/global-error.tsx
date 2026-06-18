"use client"

import { useEffect } from "react"
import Link from "next/link"

type Props = {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export default function GlobalError({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <head>
        <title>Something went wrong</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Inline Inter to avoid next/font dependency in this client boundary */}
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', system-ui, sans-serif; background: #F8FAFC; color: #2D3648; }
          .container { min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1rem; text-align: center; }
          .badge { width: 5rem; height: 5rem; border-radius: 1rem; background: #EAF2FF; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
          .code { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #717D96; margin-bottom: 0.5rem; }
          .title { font-size: 1.5rem; font-weight: 700; color: #2D3648; margin-bottom: 0.75rem; }
          .desc { color: #717D96; line-height: 1.6; margin-bottom: 2rem; max-width: 28rem; }
          .actions { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 22rem; }
          .btn-primary { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.75rem; background: #1F5FD6; padding: 0.75rem 1.25rem; font-size: 0.875rem; font-weight: 600; color: #fff; border: none; cursor: pointer; transition: background 0.15s; text-decoration: none; }
          .btn-primary:hover { background: #184FB5; }
          .btn-ghost { display: inline-flex; align-items: center; justify-content: center; border-radius: 0.75rem; border: 1px solid #e2e8f0; background: #fff; padding: 0.75rem 1.25rem; font-size: 0.875rem; font-weight: 600; color: #334155; cursor: pointer; transition: border-color 0.15s, color 0.15s; text-decoration: none; }
          .btn-ghost:hover { border-color: #CFE0FF; color: #1F5FD6; }
          .digest { font-family: monospace; font-size: 11px; color: #94a3b8; margin-top: 2rem; }
        `}</style>
      </head>
      <body>
        <div className="container">
          {/* Icon badge */}
          <div className="badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#1F5FD6"
              width="40"
              height="40"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>

          <p className="code">Error 500</p>
          <h1 className="title">Critical error</h1>
          <p className="desc">
            A critical error occurred and the application could not recover. Please
            refresh the page or go back to the home page.
          </p>

          <div className="actions">
            <button className="btn-primary" onClick={unstable_retry}>
              Refresh page
            </button>
            <Link className="btn-ghost" href="/">
              Go to home page
            </Link>
          </div>

          {error.digest && (
            <p className="digest">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  )
}
