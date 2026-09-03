import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import { InquiryCartProvider } from '@/components/public/InquiryCartProvider';
import "./[locale]/globals.css";

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nevo | Made slowly. Kept forever.",
  description: "Premium crochet and handmade home pieces made with intention and kept for years.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await headers()).get('X-NEXT-INTL-LOCALE') === 'ar' ? 'ar' : 'en';

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${geist.variable} ${geistMono.variable}`}>
      <body className={`${locale === 'ar' ? 'font-cairo' : 'font-sans'} min-h-full flex flex-col`}>
        <InquiryCartProvider>
          {children}
        </InquiryCartProvider>
      </body>
    </html>
  );
}
