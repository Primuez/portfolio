'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;
    let mapInstance: import('leaflet').Map | null = null;

    import('leaflet').then((L) => {
      if (!container) return;

      mapInstance = L.default.map(container, {
        center: [22.7196, 75.8577],
        zoom: 5,
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
          crossOrigin: '',
        }
      ).addTo(mapInstance);

      L.default.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, opacity: 0.7, crossOrigin: '' }
      ).addTo(mapInstance);
    });

    return () => {
      mapInstance?.remove();
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/');
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-dvh bg-black flex flex-col">
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="flex-1 w-full"
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
      />

      {/* Back button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000]">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#070b12]/90 text-cyan border border-cyan/40 px-5 py-2.5 rounded backdrop-blur-sm hover:bg-cyan hover:text-[#070b12] transition-colors shadow-lg"
        >
          <ArrowLeft size={14} />
          Back to Portfolio
        </button>
      </div>
    </div>
  );
}
