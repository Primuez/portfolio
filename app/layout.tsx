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
      { url: 'https://primuez.com/favicon.ico', sizes: 'any' },
      { url: 'https://primuez.com/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://primuez.com/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://primuez.com/favicon.svg', type: 'image/svg+xml' },
      { url: 'https://primuez.com/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: 'https://primuez.com/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: 'https://primuez.com/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: 'https://primuez.com/site.webmanifest',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://primuez.com/#person",
        "name": "Rahul Kasturiya",
        "alternateName": ["Primuez", "Rahul Primuez"],
        "url": "https://primuez.com",
        "image": {
          "@type": "ImageObject",
          "url": "https://primuez.com/opengraph-image",
          "width": 1200,
          "height": 630
        },
        "sameAs": [
          "https://github.com/primuez",
          "https://youtube.com/@Primuez",
          "https://www.linkedin.com/in/rahul-kasturiya-796910363"
        ],
        "jobTitle": "AI Developer & SaaS Entrepreneur",
        "description": "Self-taught AI Developer and SaaS Entrepreneur specialising in n8n automation, Supabase-powered backends, and autonomous AI agent systems. Creator of Primuez Guard — a security-monitoring autonomous agent — and multiple production SaaS products including InkTwin and PrimuezSure.",
        "knowsAbout": [
          "n8n Workflow Automation",
          "Supabase",
          "Autonomous AI Agents",
          "Large Language Models",
          "Cloudflare Workers",
          "Odoo ERP Integration",
          "SaaS Development",
          "Primuez Guard"
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "AI Developer & SaaS Entrepreneur",
          "description": "Builds n8n automation pipelines, Supabase-backed SaaS products, and autonomous agent systems for Indian SMEs.",
          "occupationLocation": {
            "@type": "City",
            "name": "Indore, Madhya Pradesh, India"
          },
          "skills": "n8n, Supabase, Autonomous Agents, LLM Orchestration, Cloudflare Workers, Odoo ERP"
        },
        "worksFor": {
          "@type": "Organization",
          "name": "Primuez",
          "url": "https://primuez.com"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Indore",
          "addressRegion": "Madhya Pradesh",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://primuez.com/#website",
        "url": "https://primuez.com",
        "name": "Primuez — AI Developer & SaaS Entrepreneur",
        "description": "Portfolio and services site for Rahul Kasturiya (Primuez) — AI Developer specialising in n8n automation, Supabase, and autonomous agents including Primuez Guard.",
        "publisher": {
          "@id": "https://primuez.com/#person"
        },
        "inLanguage": "en-IN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://primuez.com/?s={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
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
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ink-twin.primuez.in/#app",
        "name": "InkTwin",
        "url": "https://ink-twin.primuez.in",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "description": "Upload a handwriting photo and InkTwin generates a personal font from it. Type anything and it renders in your handwriting. Built on Cloudflare Workers with AI font-generation pipelines.",
        "author": { "@id": "https://primuez.com/#person" },
        "creator": { "@id": "https://primuez.com/#person" },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": ["Handwriting to Font", "AI Font Generation", "PDF Export", "AI Homework Solver"],
        "softwareVersion": "1.0",
        "inLanguage": "en"
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://primuezsure.primuez.in/#app",
        "name": "PrimuezSure Advisor",
        "url": "https://primuezsure.primuez.in",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "description": "AI-powered insurance advisor SaaS that helps users understand and choose the right insurance coverage via intelligent conversational Q&A. Powered by autonomous LLM agents on Cloudflare Workers.",
        "author": { "@id": "https://primuez.com/#person" },
        "creator": { "@id": "https://primuez.com/#person" },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": ["AI Insurance Q&A", "Autonomous LLM Agent", "Coverage Comparison"],
        "softwareVersion": "1.0",
        "inLanguage": "en"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://primuez.com/#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "About", "item": "https://primuez.com/#whoami" },
          { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://primuez.com/#projects" },
          { "@type": "ListItem", "position": 3, "name": "Services", "item": "https://primuez.com/#services" },
          { "@type": "ListItem", "position": 4, "name": "Pricing", "item": "https://primuez.com/#pricing" },
          { "@type": "ListItem", "position": 5, "name": "Stack", "item": "https://primuez.com/#stack" },
          { "@type": "ListItem", "position": 6, "name": "Contact", "item": "https://primuez.com/#contact" }
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
