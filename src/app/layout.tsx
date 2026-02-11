import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Ahhoy - Water Experiences Marketplace",
    template: "%s | Ahhoy",
  },
  description:
    "Discover unforgettable water experiences. Book fishing trips, yacht parties, sunset cruises, jet ski adventures, and more from local boat owners and captains.",
  keywords: [
    "boat rental",
    "water experiences",
    "fishing trips",
    "yacht party",
    "boat tours",
    "water sports",
    "boat charter",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
