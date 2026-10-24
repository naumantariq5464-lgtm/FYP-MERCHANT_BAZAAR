import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Merchant Bazaar — AI-Powered Online Stores",
  description:
    "Merchant Bazaar is an intelligent multi-tenant e-commerce platform that lets you launch branded online stores with real-time autonomous voice AI sales agents.",
  keywords: "e-commerce, multi-tenant, ai sales agent, voice commerce, merchant, bazaar",
  openGraph: {
    title: "Merchant Bazaar — AI-Powered Online Stores",
    description: "Launch your branded digital store with real-time AI sales agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${openSans.variable}`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
