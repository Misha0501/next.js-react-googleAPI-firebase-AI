import "@/styles/globals.scss";
import type { Metadata } from "next";
import { AuthContextProvider } from "@/app/context/AuthContext";
import { Inter } from "next/font/google";
import { Navigation } from "@/app/components/layout/Navigation";
import ReactQueryProvider from "@/app/lib/reactQuery/ReactQueryProvider";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileFooter from "@/app/components/layout/MobileFooter";
import Footer from "@/app/components/layout/Footer";
import { ScrollToTop } from "@/app/components/shared/ScrollToTop";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Real estate marketplace for Bulgarian market",
    template: "%s",
  },
  description:
    "Find properties for sale and rent across Bulgaria. Apartments, houses, and land in Sofia, Plovdiv, Varna, and beyond.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="scroll-smooth" lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="ad9c4ada-3d8c-4e8d-86f2-6ba46daa97c8"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ScrollToTop />
        <Navigation />
        <main className="flex-1 pb-28 lg:pb-0">
          <AuthContextProvider>
            <ToastContainer
              position="top-right"
              autoClose={8000}
              transition={Bounce}
            />
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </AuthContextProvider>
        </main>
        <Footer />
        <MobileFooter />
      </body>
    </html>
  );
};

export default RootLayout;
