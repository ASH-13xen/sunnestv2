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

export const metadata: Metadata = {
  title: "SunNest Power",
  description: "Turning Sunlight Into Savings",
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
