import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer } from '@/components/common/footer';
import { Header } from '@/components/common/header';
import { Toaster } from '@/components/ui/sonner';
import ReactQueryProvider from '@/providers/react-query';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BEWEAR®',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <div className="flex min-h-screen flex-col space-y-4">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
