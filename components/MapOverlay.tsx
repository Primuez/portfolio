'use client';

import { useEffect, useRef, useCallback } from 'react';
import { X, Globe } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface MapOverlayProps {
  onClose: () => void;
}

export function MapOverlay({ onClose }: MapOverlayProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;
    let mapInstance: import('leaflet').Map | null = null;

    import('leaflet').then((L) => {
      if (!container) return;

      mapInstance = L.default.map(container, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: true,
        attributionControl: true,
      });

      L.default.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18,
        }
      ).addTo(mapInstance);

      L.default.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, opacity: 0.7 }
      ).addTo(mapInstance);
    });

    return () => {
      mapInstance?.remove();
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black animate-in fade-in duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-[#070b12]/90 border-b border-cyan/20 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-cyan" />
          <span className="font-mono text-xs text-cyan uppercase tracking-widest">
            SATELLITE_VIEW.map
          </span>
          <span className="font-mono text-[10px] text-text-muted ml-2 hidden sm:inline">
            — pinch to zoom · drag to pan
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded"
          aria-label="Close satellite map"
        >
          <X size={18} />
        </button>
      </div>

      <div
        ref={mapContainerRef}
        className="flex-1 w-full"
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
        <span className="font-mono text-[10px] text-white/50 bg-black/60 px-3 py-1 rounded backdrop-blur-sm">
          ESC or tap × to close
        </span>
      </div>
    </div>
  );
}
