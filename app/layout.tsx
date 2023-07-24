import './globals.css'
import type {Metadata} from 'next'
import AuthProvider from './context/AuthProvider'

import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Real estate website for Bulgarian market',
    description: 'Real estate website for Bulgarian market with User Experience first approach',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </body>
        </html>
    )
}
