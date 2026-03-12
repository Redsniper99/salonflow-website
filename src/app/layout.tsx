import type { Metadata } from "next";
import { Raleway, Bodoni_Moda, Great_Vibes } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import SmoothScroller from "@/components/SmoothScroller";
import { themeContent } from "@/themes";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${themeContent.salonName} — ${themeContent.tagline}`,
  description: themeContent.hero.subtext,
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${raleway.variable} ${bodoniModa.variable} ${greatVibes.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <SmoothScroller />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
