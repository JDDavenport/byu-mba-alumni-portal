import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BYU MBA Alumni Network",
    template: "%s | BYU MBA Alumni Network",
  },
  description:
    "Connect with BYU Marriott School MBA alumni across industries and geographies. Find mentors, discover opportunities, and strengthen the Cougar network.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://byumba.alumni.network"
  ),
  openGraph: {
    title: "BYU MBA Alumni Network",
    description:
      "Connect with BYU Marriott School MBA alumni across industries and geographies. Find mentors, discover opportunities, and strengthen the Cougar network.",
    type: "website",
    siteName: "BYU MBA Alumni Network",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BYU MBA Alumni Network",
    description:
      "Connect with BYU Marriott School MBA alumni across industries and geographies.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
