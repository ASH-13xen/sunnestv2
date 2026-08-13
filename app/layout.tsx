import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeWipeOverlay from "@/components/ui/ThemeWipeOverlay";
import LoadingScreen from "@/components/ui/LoadingScreen";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TAGLINE,
  organizationJsonLd,
} from "@/lib/site";

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

const pageTitle = `${SITE_NAME} — ${TAGLINE}`;

// opengraph-image.png / twitter-image.png / icon.png / apple-icon.png sit in
// this directory; Next.js picks them up by file convention and emits the tags.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: pageTitle, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: pageTitle,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${plusJakarta.variable} ${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
    >
      <head>
        <link rel="preload" href="/hero-bg.mp4" as="video" type="video/mp4" />
        {/* Structured data: tells Google which image is the company logo, and
            that this is a Raipur business. Escaping `<` guards against HTML
            injection through the serialized payload. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
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
