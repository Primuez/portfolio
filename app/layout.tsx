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
  title: 'Primuez | Rahul Kasturiya — Autonomous AI Systems & n8n Automation Specialist',
  description: 'Official portfolio of Primuez (Rahul Kasturiya) — Autonomous AI Systems Builder, Certified n8n Automation Specialist, and founder of InkTwin, PrimuezSure, and Primuez Guard. Building production-grade AI workflows, Odoo ERP integrations, and custom agents.',
  keywords: [
    'Primuez',
    'Primuez AI',
    'Rahul Kasturiya',
    'Primuez Portfolio',
    'primuez.in',
    'InkTwin Primuez',
    'Primuez Guard',
    'PrimuezSure',
    'n8n Automation Freelancer',
    'AI Workflow Automation Engineer',
    'Hire n8n Developer India',
    'Custom AI Agent Developer',
    'No-Code Automation Specialist',
    'AI Automation Raipur',
    'AI Automation Indore',
    'Triple Oracle AI Certified Developer',
    'Workflow Automation consultant',
    'Odoo ERP integrator India',
    'WhatsApp automation services',
    'autonomous business systems builder',
    'enterprise n8n integrations'
  ],
  alternates: {
    canonical: 'https://primuez.in',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
  creator: 'Rahul Kasturiya (Primuez)',
  publisher: 'Primuez',
  authors: [
    { name: 'Primuez', url: 'https://primuez.in' },
    { name: 'Rahul Kasturiya', url: 'https://primuez.in' }
  ],
  other: {
    'msapplication-TileColor': '#0a0a0f',
  },
  openGraph: {
    url: 'https://primuez.in',
    siteName: 'Primuez',
    title: 'Primuez | Rahul Kasturiya — Autonomous AI Systems & n8n Automation Specialist',
    description: 'Official portfolio of Primuez (Rahul Kasturiya). Practical, production-grade autonomous AI agents, n8n workflow engineering, and live SaaS apps.',
    images: [
      {
        url: 'https://primuez.in/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Primuez (Rahul Kasturiya) – AI Systems Builder & Automation Engineer',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Primuez',
    creator: '@Primuez',
    title: 'Primuez | Rahul Kasturiya — AI Systems Builder & Automation Engineer',
    description: 'Autonomous AI agents, custom n8n pipelines, and edge systems running 24/7. Creator of InkTwin & Primuez Guard.',
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
        "name": "Primuez",
        "givenName": "Rahul",
        "familyName": "Kasturiya",
        "alternateName": [
          "Rahul Kasturiya",
          "Primuez AI",
          "Rahul Primuez",
          "Primmius"
        ],
        "url": "https://primuez.in",
        "image": {
          "@type": "ImageObject",
          "url": "https://primuez.in/opengraph-image.png",
          "width": 1200,
          "height": 630
        },
        "sameAs": [
          "https://github.com/Primuez",
          "https://github.com/Primmius",
          "https://youtube.com/@primuez",
          "https://x.com/Primuez",
          "https://linkedin.com/in/rahul-kasturiya-796910363",
          "https://inktwin.primuez.in",
          "https://primuezsure.primuez.in"
        ],
        "jobTitle": "Lead AI Systems Builder & n8n Automation Specialist",
        "description": "Primuez (Rahul Kasturiya) is a Triple Oracle Certified AI Developer, n8n Automation Specialist, and founder of InkTwin, PrimuezSure, and Primuez Guard.",
        "knowsAbout": [
          "Primuez",
          "Autonomous AI Agents",
          "n8n Workflow Automation",
          "Agentic AI Architecture",
          "Oracle Cloud Infrastructure (OCI)",
          "Google Gemini & DeepSeek API Integration",
          "Invoice Fraud Detection & Security",
          "Generative Engine Optimization (GEO)",
          "Answer Engine Optimization (AEO)",
          "Odoo ERP Integration",
          "Cloudflare Workers & Serverless Edge",
          "Next.js & Full-Stack Web Development"
        ],
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "name": "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
            "credentialCategory": "Professional Certification",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Oracle University"
            },
            "url": "https://primuez.in/documents/cert-oracle-agentic-ai.pdf"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "name": "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
            "credentialCategory": "Professional Certification",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Oracle University"
            },
            "url": "https://primuez.in/documents/cert-oracle-oci-ai.pdf"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "name": "Oracle Fusion Cloud Applications 2025 Certified AI Professional",
            "credentialCategory": "Professional Certification",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Oracle University"
            },
            "url": "https://primuez.in/documents/cert-oracle-fusion-ai.pdf"
          },
          {
            "@type": "EducationalOccupationalCredential",
            "name": "n8n Certified Workflow Specialist",
            "credentialCategory": "Workflow Automation Certification",
            "recognizedBy": {
              "@type": "Organization",
              "name": "n8n"
            },
            "url": "https://primuez.in/documents/cert-n8n-1.pdf"
          }
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Lead AI & Automation Systems Engineer",
          "description": "Designs and deploys autonomous AI agents, enterprise workflow pipelines, and micro-SaaS applications.",
          "occupationLocation": {
            "@type": "City",
            "name": "Raipur / Durg, Chhattisgarh, India"
          },
          "skills": "n8n, Oracle AI, Autonomous Agents, LLM Orchestration, Cloudflare Workers, Odoo ERP, Next.js, Postgres"
        },
        "worksFor": {
          "@type": "Organization",
          "name": "Primuez AI & Workflow Automation Agency",
          "url": "https://primuez.in"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Raipur / Durg",
          "addressRegion": "Chhattisgarh",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://primuez.in/#website",
        "url": "https://primuez.in",
        "name": "Primuez",
        "alternateName": [
          "Primuez Portfolio",
          "Rahul Kasturiya Portfolio",
          "Primuez AI",
          "primuez.in"
        ],
        "description": "Official website and portfolio of Primuez (Rahul Kasturiya) — Autonomous AI Systems Builder, n8n Automation Specialist, and founder of InkTwin, PrimuezSure, and Primuez Guard.",
        "publisher": {
          "@id": "https://primuez.in/#person"
        },
        "inLanguage": "en-IN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://primuez.in/?s={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://primuez.in/#service",
        "name": "Primuez AI & Workflow Automation Agency",
        "url": "https://primuez.in",
        "logo": "https://primuez.in/primuez-logo.svg",
        "image": "https://primuez.in/opengraph-image.png",
        "description": "Enterprise n8n workflow automation, agentic AI pipelines, lead generation systems, and custom API integrations engineered by Rahul Kasturiya (Primuez).",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Raipur / Durg",
          "addressRegion": "Chhattisgarh",
          "addressCountry": "IN"
        },
        "priceRange": "$$",
        "telephone": "+91-7838363463",
        "founder": {
          "@id": "https://primuez.in/#person"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "AI Automation & Workflow Engineering Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "n8n Workflow Automation",
                "description": "Connect Odoo, CRM, WhatsApp webhooks, and custom endpoints to eliminate manual data entry."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Agentic AI Pipelines",
                "description": "Build autonomous AI agents to audit, monitor, and execute complex business workflows."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Automated Outreach & Lead Generation",
                "description": "Scalable cold outreach pipelines via ZeptoMail, CRM sync, and lead enrichment engines."
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://primuez.in/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Primuez?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Primuez is the professional brand and online identity of Rahul Kasturiya, a Triple Oracle Certified AI Developer, n8n Automation Specialist, and founder based in Raipur/Durg, India. Primuez builds autonomous AI systems, custom n8n pipelines, and SaaS products including InkTwin, PrimuezSure, and Primuez Guard."
            }
          },
          {
            "@type": "Question",
            "name": "What is Primuez Guard?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Primuez Guard is an autonomous AI agent system designed for Web3 and enterprise invoice fraud prevention. Built by Primuez during the Agentic Commerce on Arc Hackathon, it extracts PDF line items via OCR, verifies vendor legitimacy via web search and GST records, and validates invoice totals before authorizing payment."
            }
          },
          {
            "@type": "Question",
            "name": "What open-source software has Primuez built?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Primuez is the creator of InkTwin (an open-source handwriting-to-font SaaS), PrimuezSure (an AI insurance advisor), and numerous open-source n8n automation blueprints available on GitHub at https://github.com/Primuez."
            }
          },
          {
            "@type": "Question",
            "name": "What services does Primuez offer for n8n workflow automation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Primuez specializes in custom n8n workflow engineering, autonomous AI agent pipelines, automated cold outreach via ZeptoMail, CRM synchronization, ATS job-hunter automation, and enterprise database integrations."
            }
          },
          {
            "@type": "Question",
            "name": "How can I hire a freelance n8n automation developer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can hire Rahul Kasturiya (Primuez) directly through primuez.in or via contact@primuez.in for fixed-scope automation builds or ongoing agency retainers."
            }
          },
          {
            "@type": "Question",
            "name": "What certifications does Primuez hold?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Primuez (Rahul Kasturiya) holds 3x Oracle AI Certifications (OCI 2025 Certified Generative AI Professional, OCI 2025 Certified AI Foundations Associate, and Oracle Fusion Cloud Applications 2025 Certified AI Professional), official n8n workflow certifications, and Google Kaggle AI credentials."
            }
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://inktwin.primuez.in/#app",
        "name": "InkTwin",
        "url": "https://inktwin.primuez.in",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "description": "Upload a handwriting photo and InkTwin generates a personal font from it. Type anything and it renders in your handwriting. 100% open source on GitHub.",
        "author": { "@id": "https://primuez.in/#person" },
        "creator": { "@id": "https://primuez.in/#person" },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": ["Handwriting to Font", "AI Font Generation", "PDF Export", "Open Source Canvas"],
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
        "description": "AI-powered insurance advisor SaaS that helps users understand and choose the right insurance coverage via intelligent conversational Q&A.",
        "author": { "@id": "https://primuez.in/#person" },
        "creator": { "@id": "https://primuez.in/#person" },
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
        "@id": "https://primuez.in/#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "About Primuez", "item": "https://primuez.in/#whoami" },
          { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://primuez.in/#projects" },
          { "@type": "ListItem", "position": 3, "name": "Credentials", "item": "https://primuez.in/#credentials" },
          { "@type": "ListItem", "position": 4, "name": "Services", "item": "https://primuez.in/#services" },
          { "@type": "ListItem", "position": 5, "name": "Pricing", "item": "https://primuez.in/#pricing" },
          { "@type": "ListItem", "position": 6, "name": "Stack", "item": "https://primuez.in/#stack" },
          { "@type": "ListItem", "position": 7, "name": "Contact", "item": "https://primuez.in/#contact" }
        ]
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className={`dark ${spaceMono.variable} ${syne.variable}`} style={{ backgroundColor: '#0a0a0f', color: '#ffffff', colorScheme: 'dark' }}>
      <body suppressHydrationWarning style={{ backgroundColor: '#0a0a0f', color: '#ffffff', colorScheme: 'dark' }} className="bg-[#0a0a0f] text-[#ffffff] font-sans antialiased selection:bg-[#00f0ff]/20 selection:text-white overflow-x-hidden">
        {/* SVG Noise Texture Overlay — pointer-events: none, GPU-accelerated */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay gpu-accelerated"
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
