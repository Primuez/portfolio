'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface CertPdfViewerProps {
  url: string;
  title: string;
}

export function CertPdfViewer({ url, title }: CertPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div
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
          file={url}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false); }}
          onLoadError={() => { setError(true); setLoading(false); }}
          loading={null}
          className="flex flex-col items-center gap-2 py-3"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={Math.min(typeof window !== 'undefined' ? window.innerWidth - 32 : 340, 600)}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-md"
            />
          ))}
        </Document>
      )}
    </div>
  );
}
