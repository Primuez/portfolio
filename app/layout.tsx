import type { Metadata, Viewport } from 'next';
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
  metadataBase: new URL('https://primuez.in'),
  title: 'Primuez | Lead AI & n8n Automation Engineer',
  description: 'Enterprise n8n workflow automation, agentic AI pipelines, lead generation systems, and custom API integrations engineered by Rahul Kasturiya (Primuez).',
  keywords: [
    'n8n Workflow Automation',
    'Agentic AI Architecture',
    'OpenAI LLM API Integration',
    'ZeptoMail Cold Outreach Pipelines',
    'PostgreSQL & SQLite Database Engineering',
    'n8n developer India',
    'Rahul Kasturiya',
    'Primuez AI',
    'freelance n8n developer'
  ],
  alternates: {
    canonical: 'https://primuez.in',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-placeholder-token',
  },
  classification: 'AI Workflow Automation & Systems Engineering Agency',
  category: 'technology',
  creator: 'Rahul Kasturiya',
  publisher: 'Rahul Kasturiya',
  authors: [{ name: 'Rahul Kasturiya', url: 'https://primuez.in' }],
  other: {
    'msapplication-TileColor': '#0a0a0f',
  },
  openGraph: {
    url: 'https://primuez.in',
    siteName: 'Primuez',
    title: 'Primuez | Enterprise n8n Automation & Agentic AI Systems',
    description: 'Enterprise n8n workflow engineering, autonomous AI agent pipelines, and automated lead generation systems built for scale.',
    images: [
      {
        url: 'https://primuez.in/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Primuez – Lead AI & n8n Automation Engineer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Primuez',
    creator: '@Primuez',
    title: 'Primuez | Enterprise n8n Automation & Agentic AI Systems',
    description: 'Custom n8n workflows, autonomous agents & lead generation pipelines running 24/7.',
    images: ['https://primuez.in/opengraph-image.png'],
  },
  icons: {
    icon: [
      { url: 'https://primuez.in/favicon.ico', sizes: 'any' },
      { url: 'https://primuez.in/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://primuez.in/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://primuez.in/favicon.svg', type: 'image/svg+xml' },
      { url: 'https://primuez.in/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: 'https://primuez.in/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: 'https://primuez.in/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: 'https://primuez.in/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#00f0ff',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://primuez.in/#person",
        "name": "Rahul Kasturiya",
        "alternateName": ["Primuez", "Rahul Primuez"],
        "jobTitle": "Lead AI & n8n Automation Engineer",
        "url": "https://primuez.in",
        "image": {
          "@type": "ImageObject",
          "url": "https://primuez.in/opengraph-image.png",
          "width": 1200,
          "height": 630
        },
        "sameAs": [
          "https://github.com/primuez",
          "https://linkedin.com/in/rahul-kasturiya-796910363",
          "https://youtube.com/@Primuez"
        ],
        "knowsAbout": [
          "n8n Workflow Automation",
          "Agentic AI Architecture",
          "OpenAI & LLM API Integration",
          "ZeptoMail & Cold Outreach Pipelines",
          "PostgreSQL & SQLite Database Engineering",
          "Cloudflare Workers",
          "Odoo ERP Integration"
        ],
        "worksFor": {
          "@type": "Organization",
          "name": "Primuez AI & Workflow Automation Agency",
          "url": "https://primuez.in"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://primuez.in/#service",
        "name": "Primuez AI & Workflow Automation Agency",
        "url": "https://primuez.in",
        "logo": "https://primuez.in/primuez-logo.svg",
        "image": "https://primuez.in/opengraph-image.png",
        "description": "Enterprise n8n workflow automation, agentic AI pipelines, lead generation systems, and custom API integrations engineered by Rahul Kasturiya (Primuez)."
      },
      {
        "@type": "FAQPage",
        "@id": "https://primuez.in/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What services does Primuez offer for n8n workflow automation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Primuez specializes in custom n8n workflow engineering, AI agent pipelines, automated cold outreach via ZeptoMail, CRM sync, ATS job-hunter automation, and enterprise database integrations."
            }
          },
          {
            "@type": "Question",
            "name": "How can I hire a freelance n8n automation developer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can hire Rahul Kasturiya (Primuez) directly through primuez.in or via contact@primuez.in for fixed-scope automation builds or ongoing agency retainers."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${spaceMono.variable} ${syne.variable}`}>
      <body suppressHydrationWarning className="bg-[#0a0a0f] text-[#e8e8ec] font-sans antialiased selection:bg-[#00f0ff]/20 selection:text-white overflow-x-hidden relative">
        {/* Visual Texture: SVG noise overlay, GPU accelerated */}
        <div 
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] mix-blend-overlay will-change-transform transform-gpu translate-z-0"
        >
          <svg className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
