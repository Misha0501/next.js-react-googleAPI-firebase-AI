import './globals.scss'
import type {Metadata} from 'next'
import Head from 'next/head'
import {AuthContextProvider} from './context/AuthContext'
import logo from '@/public/BoraLogo.png'
import Image from 'next/image'
import {Inter} from 'next/font/google'
import Link from "next/link";
import {Navigation} from "@/app/components/Navigation";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Real estate website for Bulgarian market',
    description: 'Real estate website for Bulgarian market with User Experience first approach',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
            <script async
                    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAuL3ldHARXcYSsaNhLNRrzLgUDxLtEiAA&libraries=places&callback=initMap">
            </script>
            <meta
                name='viewport'
                content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
            />
        </head>
        <body>
            <Navigation/>
            <main>
                <AuthContextProvider>
                    {children}
                </AuthContextProvider>
            </main>
        </body>
        </html>
    )
}
