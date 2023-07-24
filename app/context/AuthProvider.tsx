'use client'

import { SessionProvider } from 'next-auth/react'

// This is a wrapper function to enable sessions on the client side of the application
export default function AuthProvider({ children }: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
