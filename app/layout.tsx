import type {Metadata} from 'next';
import { Space_Mono, Syne } from 'next/font/google';
import './globals.css';

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
  keywords: ['AI developer', 'automation engineer', 'n8n', 'AI workflows', 'SaaS founder', 'Primuez', 'Rahul Kasturiya', 'Indore'],
  authors: [{ name: 'Rahul Kasturiya', url: 'https://primuez.com' }],
  creator: 'Rahul Kasturiya',
  openGraph: {
    type: 'website',
    url: 'https://primuez.com',
    title: 'Primuez | AI Systems Builder & Automation Engineer',
    description: 'Self-taught AI Developer building autonomous agents, intelligent workflows, and shipped products — from Indore, India.',
    siteName: 'Primuez',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Primuez — AI Systems Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Primuez | AI Systems Builder',
    description: 'Self-taught AI Developer building autonomous agents, intelligent workflows, and shipped products.',
    images: ['/og-image.png'],
    creator: '@primuez',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/primuez-icon.svg', type: 'image/svg+xml' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://primuez.com',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${syne.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="bg-[#0a0a0f] text-[#e0e0e0] font-sans antialiased selection:bg-[#00f0ff] selection:text-[#0a0a0f] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
