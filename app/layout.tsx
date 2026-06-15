import "@/styles/globals.scss";
import type { Metadata } from "next";
import { AuthContextProvider } from "./context/AuthContext";
import { Inter } from "next/font/google";
import { Navigation } from "@/app/components/layout/Navigation";
import ReactQueryProvider from "@/app/lib/reactQuery/ReactQueryProvider";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MobileFooter from "@/app/components/layout/MobileFooter";
import Footer from "@/app/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real estate marketplace for Bulgarian market",
  description:
    "Real estate marketplace for Bulgarian market with User Experience first approach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
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
}
