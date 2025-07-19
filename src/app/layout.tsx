import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlazeUp',
  description: 'Connect with world-class freelancers who turn ambitious ideas into exceptional results. From concept to completion, we make it happen.',
  keywords: 'freelancers, development, design, marketing, business strategy, AI, automation',
  authors: [{ name: 'BlazeUp Team' }],
  openGraph: {
    title: 'BlazeUp',
    description: 'Connect with world-class freelancers who turn ambitious ideas into exceptional results.',
    url: 'https://blazeup.com',
    siteName: 'BlazeUp',
    images: [
      {
        url: '/og-image.jpg',
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
    images: ['/og-image.jpg'],
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
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}