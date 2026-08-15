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
  title: 'Primuez | AI Systems Builder & Automation Engineer Indore',
  description: 'Self-taught AI Developer, Automation Engineer & SaaS Founder from Indore, Raipur, India. I build custom n8n workflows, autonomous LLM agents, and Odoo ERP integrations for Indian SMEs.',
  keywords: [
    'n8n Automation Freelancer',
    'AI Workflow Automation Engineer',
    'Hire n8n Developer India',
    'Custom AI Agent Developer',
    'No-Code Automation Specialist',
    'AI Automation Indore',
    'AI Automation Raipur',
    'n8n developer India',
    'Workflow Automation consultant',
    'Odoo ERP integrator India',
    'WhatsApp automation services',
    'Primuez AI',
    'Rahul Kasturiya',
    'autonomous business systems builder',
    'enterprise n8n integrations'
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
    title: 'Primuez | AI Automation Agency & n8n Specialist',
    description: 'Practical, production-grade AI systems and autonomous workflows. Eliminate manual DM admin, automate Odoo ERP ledger entries, and recon GST instantly.',
    images: [
      {
        url: 'https://primuez.in/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Primuez – AI Systems Builder & Automation Engineer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Primuez',
    creator: '@Primuez',
    title: 'Primuez | AI Systems Builder & Automation Engineer',
    description: 'Custom n8n workflows, autonomous agents & serverless edge systems running 24/7.',
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
        "url": "https://primuez.in",
        "image": {
          "@type": "ImageObject",
          "url": "https://primuez.in/opengraph-image",
          "width": 1200,
          "height": 630
        },
        "sameAs": [
          "https://github.com/primuez",
          "https://youtube.com/@Primuez",
          "https://linkedin.com/in/rahul-kasturiya-796910363"
        ],
        "jobTitle": "Lead AI & n8n Automation Engineer",
        "description": "Self-taught AI Developer, n8n Automation Specialist, and SaaS Entrepreneur. Creator of Primuez Guard and founder of InkTwin and PrimuezSure.",
        "knowsAbout": [
          "n8n Workflow Automation",
          "Agentic AI Architecture",
          "OpenAI & LLM API Integration",
          "ZeptoMail & Cold Outreach Pipelines",
          "PostgreSQL & SQLite Database Engineering",
          "Supabase",
          "Cloudflare Workers",
          "Odoo ERP Integration"
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Lead AI & n8n Automation Engineer",
          "description": "Builds autonomous workflow pipelines, custom AI agents, and lead outreach engines.",
          "occupationLocation": {
            "@type": "City",
            "name": "Raipur / Durg, Chhattisgarh, India"
          },
          "skills": "n8n, Supabase, Autonomous Agents, LLM Orchestration, Cloudflare Workers, Odoo ERP, Postgres"
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
        "name": "Primuez — AI Developer & n8n Automation Specialist",
        "description": "Enterprise n8n workflow automation, agentic AI pipelines, lead generation systems, and custom API integrations engineered by Rahul Kasturiya (Primuez).",
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
        "image": "https://primuez.in/opengraph-image",
        "description": "Enterprise n8n workflow automation, agentic AI pipelines, lead generation systems, and custom API integrations engineered by Rahul Kasturiya (Primuez).",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Raipur / Durg",
          "addressRegion": "Chhattisgarh",
          "addressCountry": "IN"
        },
        "priceRange": "$$",
        "telephone": "+91-7838363463",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "AI Automation & Workflow Engineering Services",
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
          },
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
        "author": { "@id": "https://primuez.in/#person" },
        "creator": { "@id": "https://primuez.in/#person" },
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
          { "@type": "ListItem", "position": 1, "name": "About", "item": "https://primuez.in/#whoami" },
          { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://primuez.in/#projects" },
          { "@type": "ListItem", "position": 3, "name": "Services", "item": "https://primuez.in/#services" },
          { "@type": "ListItem", "position": 4, "name": "Pricing", "item": "https://primuez.in/#pricing" },
          { "@type": "ListItem", "position": 5, "name": "Stack", "item": "https://primuez.in/#stack" },
          { "@type": "ListItem", "position": 6, "name": "Contact", "item": "https://primuez.in/#contact" }
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
