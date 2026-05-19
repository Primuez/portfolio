import type {Metadata} from 'next';
import { Space_Mono, Syne } from 'next/font/google';
import './globals.css';
import FloatingMobileCTA from '@/components/FloatingMobileCTA';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://primuez.com'),
  title: 'Primuez | AI Systems Builder & Automation Engineer',
  description: 'Portfolio of Rahul Kasturiya (Primuez). Self-taught AI Developer, Automation Engineer & SaaS Founder from Indore, India. I build autonomous workflows and live products.',
  other: {
    'msapplication-TileColor': '#0a0a0f',
  },
  openGraph: {
    url: 'https://primuez.com',
    siteName: 'Primuez',
    title: 'Primuez | AI Systems Builder & Automation Engineer',
    description: 'Portfolio of Rahul Kasturiya (Primuez). Self-taught AI Developer, Automation Engineer & SaaS Founder from Indore, India. I build autonomous workflows and live products.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Primuez – AI Systems Builder & Automation Engineer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Primuez | AI Systems Builder & Automation Engineer',
    description: 'Portfolio of Rahul Kasturiya (Primuez). Self-taught AI Developer, Automation Engineer & SaaS Founder from Indore, India. I build autonomous workflows and live products.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${syne.variable}`}>
      <head>
        <meta name="theme-color" content="#00f0ff" />
        <meta name="msapplication-TileColor" content="#0a0a0f" />
      </head>
      <body suppressHydrationWarning className="bg-[#0a0a0f] text-[#e8e8ec] font-sans antialiased selection:bg-[#00f0ff]/20 selection:text-white overflow-x-hidden">
        {children}
        <FloatingMobileCTA />
      </body>
    </html>
  );
}
