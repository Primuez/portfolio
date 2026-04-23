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
  title: 'Primuez | AI Systems Builder & Automation Engineer',
  description: 'Portfolio of Rahul Kasturiya (Primuez). Self-taught AI Developer, Automation Engineer & SaaS Founder from Indore, India. I build autonomous workflows and live products.',
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
