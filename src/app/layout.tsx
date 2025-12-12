import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SalonFlow - Luxury Salon Services",
  description: "Experience luxury salon services where beauty meets elegance. Professional hair styling, nail care, spa treatments, and more.",
};

import SmoothScroller from "@/components/SmoothScroller";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <SmoothScroller />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
