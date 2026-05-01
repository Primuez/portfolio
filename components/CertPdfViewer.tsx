'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface CertPdfViewerProps {
  url: string;
  title: string;
}

function parsePdfUrl(url: string): { src: string; startPage: number } {
  const match = url.match(/#page=(\d+)/);
  const startPage = match ? parseInt(match[1], 10) : 1;
  const src = url.replace(/#.*$/, '');
  return { src, startPage };
}

export function CertPdfViewer({ url, title }: CertPdfViewerProps) {
  const { src, startPage } = parsePdfUrl(url);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageWidth, setPageWidth] = useState(340);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setPageWidth(Math.min(el.clientWidth - 24, 600));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!loading && numPages > 0 && startPage > 1) {
      const targetIndex = Math.min(startPage, numPages) - 1;
      requestAnimationFrame(() => {
        pageRefs.current[targetIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [loading, numPages, startPage]);

  return (
    <div
      ref={containerRef}
      aria-label={title}
      className="w-full overflow-auto overscroll-contain"
      style={{ maxHeight: '70vh', touchAction: 'pan-y pinch-zoom', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
    >
      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <span className="font-mono text-xs text-cyan/60 uppercase tracking-widest animate-pulse">Loading PDF…</span>
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-6">
          <span className="font-mono text-xs text-red-400 uppercase tracking-widest text-center">Could not render PDF inline.</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase bg-cyan text-bg border border-cyan px-6 py-3 hover:bg-cyan/80 transition-colors"
          >
            Open in new tab
          </a>
        </div>
      ) : (
        <Document
          file={src}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false); }}
          onLoadError={() => { setError(true); setLoading(false); }}
          loading={null}
          className="flex flex-col items-center gap-2 py-3"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <div
              key={i + 1}
              ref={(el) => { pageRefs.current[i] = el; }}
            >
              <Page
                pageNumber={i + 1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-md"
              />
            </div>
          ))}
        </Document>
      )}
    </div>
  );
}
