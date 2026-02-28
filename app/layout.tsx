import './globals.css';
import type { Metadata } from 'next';
import CloudStatusBanner from '../components/CloudStatusBanner';
import PageTransition from '../components/PageTransition';
import RouteProgressBar from '../components/RouteProgressBar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'LinuxHunter',
  description: 'LeetCode-style Linux command training with RPG progression.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <CloudStatusBanner />
        <PageTransition>{children}</PageTransition>
        <RouteProgressBar />
      </body>
    </html>
  );
}
