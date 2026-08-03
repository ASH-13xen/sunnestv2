import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeWipeOverlay from "@/components/ui/ThemeWipeOverlay";
import LoadingScreen from "@/components/ui/LoadingScreen";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Absolute URLs for og:image/twitter:image are resolved against this. Override
// via NEXT_PUBLIC_SITE_URL if the site ships on a different domain — social
// crawlers can't fetch relative paths, so a wrong value means no share preview.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunnestpower.com";

const description =
  "SunNest Power designs, permits, and commissions high-yield solar systems across India — residential rooftops to industrial captive plants. Turning sunlight into savings.";

// opengraph-image.png / twitter-image.png / icon.png / apple-icon.png sit in
// this directory; Next.js picks them up by file convention and emits the tags.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SunNest Power — Turning Sunlight Into Savings",
    template: "%s | SunNest Power",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "SunNest Power",
    title: "SunNest Power — Turning Sunlight Into Savings",
    description,
    url: siteUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SunNest Power — Turning Sunlight Into Savings",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
    >
      <head>
        <link rel="preload" href="/hero-bg.mp4" as="video" type="video/mp4" />
      </head>
      <body>
        <ThemeProvider>
          <LoadingScreen />
          <ThemeWipeOverlay />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
