import "./globals.scss";
import type { Metadata } from "next";
import { AuthContextProvider } from "./context/AuthContext";
import { Inter } from "next/font/google";
import { Navigation } from "@/app/components/Navigation";
import Providers from "@/utils/provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real estate website for Bulgarian market",
  description:
    "Real estate website for Bulgarian market with User Experience first approach",
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

        <script
          async
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAuL3ldHARXcYSsaNhLNRrzLgUDxLtEiAA&libraries=places&callback=initMap"
        ></script>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body>
        <Navigation />
        <main className="pb-12 md:pb-0">
          <AuthContextProvider>
            <ToastContainer autoClose={8000} />
            <Providers>{children}</Providers>
          </AuthContextProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
