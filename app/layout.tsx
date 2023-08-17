import './globals.css'
import type {Metadata} from 'next'
import {AuthContextProvider} from './context/AuthContext'

import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Real estate website for Bulgarian market',
    description: 'Real estate website for Bulgarian market with User Experience first approach',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
        </body>
        </html>
    )
}
