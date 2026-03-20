import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "translate123",
  description: "Real-time bilingual conversation translator",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "translate123",
    description: "Real-time bilingual conversation translator",
    images: [{ url: "/og-image.png", width: 1200, height: 1200 }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "translate123",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Analytics />
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
