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
  title: 'Primuez | AI Systems Builder & Automation Engineer Indore',
  description: 'Self-taught AI Developer, Automation Engineer & SaaS Founder from Indore, Raipur, India. I build custom n8n workflows, autonomous LLM agents, and Odoo ERP integrations for Indian SMEs.',
  keywords: [
    'AI Automation Indore',
    'AI Automation Raipur',
    'n8n developer India',
    'Workflow Automation consultant',
    'Odoo ERP integrator India',
    'WhatsApp automation services',
    'Primuez AI',
    'Rahul Kasturiya',
    'autonomous business systems builder',
    'no code automation India',
    'enterprise n8n integrations'
  ],
  alternates: {
    canonical: 'https://primuez.com',
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
  authors: [{ name: 'Rahul Kasturiya', url: 'https://primuez.com' }],
  other: {
    'msapplication-TileColor': '#0a0a0f',
  },
  openGraph: {
    url: 'https://primuez.com',
    siteName: 'Primuez',
    title: 'Primuez | AI Automation Agency & n8n Specialist',
    description: 'Practical, production-grade AI systems and autonomous workflows. Eliminate manual DM admin, automate Odoo ERP ledger entries, and recon GST instantly.',
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
    description: 'Custom n8n workflows, autonomous agents & serverless edge systems running 24/7.',
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://primuez.com/#person",
        "name": "Rahul Kasturiya",
        "alternateName": "Primuez",
        "url": "https://primuez.com",
        "image": "https://primuez.com/opengraph-image",
        "sameAs": [
          "https://github.com/primuez",
          "https://youtube.com/@Primuez",
          "https://www.linkedin.com/in/rahul-kasturiya-796910363"
        ],
        "jobTitle": "AI Systems Builder & Automation Engineer",
        "worksFor": {
          "@type": "Organization",
          "name": "Primuez"
        },
        "description": "Self-taught AI Developer, Automation Engineer & SaaS Founder from Indore, Raipur, India."
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://primuez.com/#service",
        "name": "Primuez AI Systems",
        "url": "https://primuez.com",
        "logo": "https://primuez.com/primuez-logo.svg",
        "image": "https://primuez.com/opengraph-image",
        "description": "Custom workflow automations, n8n integration, LLM autonomous agent design, Odoo ERP connection, and serverless edge deployment for small and mid-sized businesses.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Indore",
          "addressRegion": "Madhya Pradesh",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "22.7196",
          "longitude": "75.8577"
        },
        "priceRange": "$$",
        "telephone": "+91-7838363463",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "AI Automation Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "n8n Workflow Automation",
                "description": "Connect Odoo, CRM, WhatsApp webhooks, and custom endpoints to eliminate manual entry."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Autonomous LLM Agents",
                "description": "Build personal agents like OpenClaw and Hermes to securely audit and monitor business infrastructure."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Odoo ERP Integrations",
                "description": "Seamless real-time ledger entries, GST auto-reconciliation, and IndiaMART webhook setups."
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://primuez.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How long does a project typically take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Micro-Builds are delivered in 2–4 days. Professional Automation projects take 5–10 days. Premium AI Integration or SaaS MVPs take 2–4 weeks depending on scope. Timeline is agreed before work begins — no vague 'it depends.'"
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to manage you or check in constantly?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. You describe the outcome you need, I ask any clarifying questions upfront, then disappear and build. You get async updates and a final handover call. You don't need to know how any of it works technically."
            }
          },
          {
            "@type": "Question",
            "name": "You're self-taught — how do I know the work will be solid?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Look at what shipped: InkTwin (live SaaS), PrimuezSure (live SaaS), the Odoo Enterprise architecture presented at a business show in Raipur, the CA Automation Suite used by actual firms. Self-taught means I learned by building real systems, not passing exams."
            }
          },
          {
            "@type": "Question",
            "name": "Can you integrate with tools I already use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Almost certainly yes. If it has an API, webhook, or can export data — I can connect it. Current integrations include Odoo, Zoho, WhatsApp (via Evolution API), GST portal, IndiaMART, Kickbox, Cloudflare, Vercel, Google Workspace, and any standard REST/HTTP endpoint."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${spaceMono.variable} ${syne.variable}`}>
      <head>
        <meta name="theme-color" content="#00f0ff" />
        <meta name="msapplication-TileColor" content="#0a0a0f" />
        <link rel="canonical" href="https://primuez.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#0a0a0f] text-[#e8e8ec] font-sans antialiased selection:bg-[#00f0ff]/20 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
