import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar';
import { Inter } from 'next/font/google';
import Footer from './components/layout/Footer';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BlazeUp – AI Native Finance OS for Corporate Expenses',
  description: 'The AI-native corporate spend management platform. Issue smart corporate cards, enforce spend policies in real time, and eliminate reimbursement headaches — built for India, the Gulf, and Southeast Asia.',
  keywords: 'corporate cards, expense management, spend management, reimbursements, finance OS, AI finance, corporate spend, fintech, India, Gulf, ASEAN, MENA, Dubai',
  authors: [{ name: 'BlazeUp Team' }],
  openGraph: {
    title: 'BlazeUp – AI Native Finance OS for Corporate Expenses',
    description: 'Issue corporate cards, enforce spend policies, and automate reimbursements with AI.',
    url: 'https://blazeup.app',
    siteName: 'BlazeUp',
    images: [
      {
        url: '/image_assets/BlazeUp_fire_bw_no_bg.svg',
        width: 1200,
        height: 630,
        alt: 'BlazeUp – AI Native Finance OS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlazeUp – AI Native Finance OS for Corporate Expenses',
    description: 'Issue corporate cards, enforce spend policies, and automate reimbursements with AI.',
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <Navbar/>
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}