import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const description =
  'BlazeUp has ceased operations, and this website is no longer active.';

export const metadata: Metadata = {
  metadataBase: new URL('https://blazeup.app'),
  title: 'BlazeUp — No Longer Operating',
  description,
  applicationName: 'BlazeUp',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BlazeUp — No Longer Operating',
    description,
    url: '/',
    siteName: 'BlazeUp',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'BlazeUp — No Longer Operating',
    description,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#f5f2ec',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
