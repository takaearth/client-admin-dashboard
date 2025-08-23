import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit, Space_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
// ui
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
// custom
import { CountryProvider } from "@/context/country-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Taka Earth Dashboard",
  description: "Taka Earth internal administrative dashboard",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${inter.variable} ${outfit.variable}  antialiased`}>
        <NextTopLoader color="#fbbf24" height={5} />
        <CountryProvider>
          <SessionProvider>{children}</SessionProvider>
        </CountryProvider>
        <Toaster />
      </body>
    </html>
  );
}
