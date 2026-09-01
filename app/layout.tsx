import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartDock } from '@/components/public/CartDock';
import { InquiryCartProvider } from '@/components/public/InquiryCartProvider';
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
  title: "Nevo | Made slowly. Kept forever.",
  description: "Premium crochet and handmade home pieces made with intention and kept for years.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <InquiryCartProvider>
          {children}
          <CartDock />
        </InquiryCartProvider>
      </body>
    </html>
  );
}
