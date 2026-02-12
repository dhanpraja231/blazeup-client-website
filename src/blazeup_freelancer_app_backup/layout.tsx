import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar';
import { Inter } from 'next/font/google';
import Footer from './components/layout/Footer';
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});


export const metadata: Metadata = {
  title: 'BlazeUp',
  description: 'Connect with world-class freelancers who turn ambitious ideas into exceptional results. From concept to completion, we make it happen.',
  keywords: 'freelancers, development, design, marketing, business strategy, AI, automation',
  authors: [{ name: 'BlazeUp Team' }],
  openGraph: {
    title: 'BlazeUp',
    description: 'Connect with world-class freelancers who turn ambitious ideas into exceptional results.',
    url: 'https://blazeup.app',
    siteName: 'BlazeUp',
    images: [
      {
        url: '/image_assets/BlazeUp_fire_bw_no_bg.svg',
        width: 1200,
        height: 630,
        alt: 'BlazeUp - Premium Freelancer Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlazeUp - Transform Your Vision Into Reality',
    description: 'Connect with world-class freelancers who turn ambitious ideas into exceptional results.',
    images: ['/image_assets/BlazeUp_fire_bw_no_bg.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
