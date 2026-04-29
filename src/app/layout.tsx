import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BoosterBuzz — Stop Wasting Ad Spend. Get AI Campaign Plans in 5 Minutes.",
  description:
    "For founders, ecommerce brands, and marketers — get AI-powered ad campaign plans with clear fixes to lower CPA and boost ROAS across Meta, TikTok, Google, YouTube, LinkedIn, and Pinterest.",
  keywords: [
    "ad campaigns",
    "lower CPA",
    "boost ROAS",
    "ad audit",
    "Meta Ads",
    "TikTok Ads",
    "Google Ads",
    "campaign optimization",
    "digital advertising",
    "ad spend",
    "ecommerce marketing",
  ],
  authors: [{ name: "BoosterBuzz" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
