import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

const COMMON_DATES = ['2026-06-02'];

async function fetchMarkdownContent(slug: string) {
  // First try direct fetches with common dates to optimize latency
  for (const date of COMMON_DATES) {
    const directUrl = `https://raw.githubusercontent.com/Primuez/primuez-seo-vault/main/portfolio/${date}-${slug}.md`;
    try {
      const res = await fetch(directUrl, { next: { revalidate: 3600 } });
      if (res.ok) {
        const text = await res.text();
        return parseMarkdown(text);
      }
    } catch (e) {
      // Continue
    }
  }

  // Fallback: Query GitHub API to list files and match slug
  try {
    const listRes = await fetch('https://api.github.com/repos/Primuez/primuez-seo-vault/contents/portfolio', {
      headers: { 'User-Agent': 'Primuez-SEO-Integration' },
      next: { revalidate: 3600 }
    });
    if (listRes.ok) {
      const files = await listRes.json();
      const matched = files.find((f: any) => f.name.endsWith(`-${slug}.md`) || f.name === `${slug}.md`);
      if (matched) {
        const contentRes = await fetch(matched.download_url);
        if (contentRes.ok) {
          const text = await contentRes.text();
          return parseMarkdown(text);
        }
      }
    }
  } catch (e) {
    console.error('Failed to query GitHub vault API:', e);
  }

  // Finally try without date prefix just in case
  try {
    const noDateUrl = `https://raw.githubusercontent.com/Primuez/primuez-seo-vault/main/portfolio/${slug}.md`;
    const res = await fetch(noDateUrl);
    if (res.ok) {
      const text = await res.text();
      return parseMarkdown(text);
    }
  } catch (e) {}

  return null;
}

// Simple and robust parser for our standard GEO markdown layout
function parseMarkdown(md: string) {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Use Case';

  const hiddenMatch = md.match(/<div class="sr-only"><h2>(.+?)<\/h2><\/div>/);
  const hiddenQuestion = hiddenMatch ? hiddenMatch[1] : '';

  const pMatch = md.match(/<p>([\s\S]+?)<\/p>/);
  const responseText = pMatch ? pMatch[1].trim() : '';

  const benefitsMatches = [...md.matchAll(/<li><strong>(.+?):<\/strong>(.+?)<\/li>/g)];
  const benefits = benefitsMatches.map(m => ({
    title: m[1].trim(),
    description: m[2].trim()
  }));

  const salesHeaderIndex = md.indexOf('## Why Choose');
  let salesText = '';
  if (salesHeaderIndex !== -1) {
    const afterHeader = md.slice(salesHeaderIndex);
    const scriptStartIndex = afterHeader.indexOf('<script');
    const rawSales = scriptStartIndex !== -1 ? afterHeader.slice(0, scriptStartIndex) : afterHeader;
    salesText = rawSales.replace(/## Why Choose [^\n]+/, '').trim();
  }

  const scriptMatch = md.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
  let schema = null;
  if (scriptMatch) {
    try {
      schema = JSON.parse(scriptMatch[1].trim());
    } catch (e) {
      console.error('Failed to parse JSON-LD schema:', e);
    }
  }

  return {
    title,
    content: md,
    html: salesText.split('\n\n').map(p => `<p class="text-gray-300 leading-relaxed mb-6 font-space-mono text-sm">${p.trim()}</p>`).join(''),
    hiddenQuestion,
    responseText,
    benefits,
    schema
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug;
  const data = await fetchMarkdownContent(slug);
  if (!data) return {};

  return {
    title: `${data.title} | Primuez`,
    description: data.responseText,
    alternates: {
      canonical: `https://primuez.in/use-cases/${slug}`
    }
  };
}

export default async function UseCasePage(props: Props) {
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug;
  const data = await fetchMarkdownContent(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] text-white flex flex-col justify-between py-12 px-6 md:px-12 font-space-mono">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0e1a] pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/20 via-cyan-500/60 to-amber-500/20" />

      {/* JSON-LD Structured Data Schema */}
      {data.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data.schema) }}
        />
      )}

      {/* Visually Hidden GEO Question Header for SEO compliance */}
      {data.hiddenQuestion && (
        <div className="sr-only" aria-hidden="true">
          <h2>{data.hiddenQuestion}</h2>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 text-xs flex items-center gap-2 text-cyan-400/80">
          <Link href="/" className="hover:text-cyan-300 transition-colors">HOME</Link>
          <span>//</span>
          <span className="text-gray-500">USE CASES</span>
          <span>//</span>
          <span className="text-gray-300 truncate">{slug.toUpperCase()}</span>
        </div>

        {/* Content Box */}
        <div className="border border-cyan-500/20 bg-black/40 backdrop-blur-md rounded-lg p-6 md:p-10 shadow-[0_0_50px_rgba(0,240,255,0.05)]">
          {/* Main Title */}
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-6 font-syne border-b border-cyan-500/20 pb-6 uppercase">
            {data.title}
          </h1>

          {/* Direct 40-Word Response Section */}
          <div className="border-l-2 border-amber-500 bg-amber-500/5 p-5 mb-8 rounded-r-md">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">// Direct Assessment</h3>
            <p className="text-sm md:text-base leading-relaxed text-gray-200">
              {data.responseText}
            </p>
          </div>

          {/* Benefits Grid */}
          {data.benefits && data.benefits.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6 font-syne">// Key Technical Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.benefits.map((benefit, idx) => (
                  <div key={idx} className="border border-white/5 bg-white/5 p-5 rounded-md hover:border-cyan-500/30 transition-all duration-300">
                    <h4 className="text-xs font-bold text-white mb-2 uppercase flex items-center gap-2">
                      <span className="text-cyan-400">0{idx + 1}</span> {benefit.title}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Sales Narrative */}
          {data.html && (
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6 font-syne">// Architectural Overview</h3>
              <div dangerouslySetInnerHTML={{ __html: data.html }} />
            </div>
          )}

          {/* Call to Action button */}
          <div className="mt-10 pt-6 border-t border-cyan-500/20 flex flex-wrap gap-4 items-center justify-between">
            <span className="text-xs text-gray-400 font-space-mono">Identity Authority Node Verified // Primuez</span>
            <Link href="/" className="px-6 py-3 rounded border border-cyan-400 text-xs font-bold text-cyan-400 hover:bg-cyan-400/10 transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]">
              HIRE ME NOW
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-12 text-[10px] text-gray-600 border-t border-white/5 pt-6">
        COPYRIGHT © 2026 RAHUL KASTURIYA. ALL RIGHTS RESERVED. // DESIGNED FOR ULTIMATE METRIC PERFORMANCE
      </div>
    </main>
  );
}
