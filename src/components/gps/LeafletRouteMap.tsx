import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GPSPoint } from '../../types';

interface LeafletRouteMapProps {
  points: GPSPoint[];
  currentPoint?: GPSPoint | null;
  interactive?: boolean;
  followRunner?: boolean;
  className?: string;
  zoomLevel?: number;
}

export const LeafletRouteMap: React.FC<LeafletRouteMapProps> = ({
  points,
  currentPoint,
  interactive = true,
  followRunner = true,
  className = 'h-72 w-full',
  zoomLevel = 15,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);

  // Default coordinate: Chhatrapati Sambhajinagar center (Kranti Chowk / Jalna Road)
  const defaultCenter: [number, number] = [19.8762, 75.3433];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map container already initialized
    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] =
        points.length > 0
          ? [points[points.length - 1].latitude, points[points.length - 1].longitude]
          : currentPoint
          ? [currentPoint.latitude, currentPoint.longitude]
          : defaultCenter;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: zoomLevel,
        zoomControl: interactive,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        attributionControl: false,
      });

      // Crisp OpenStreetMap tiles with clean contrast
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      // Polyline for route with RunFam electric volt styling
      const polyline = L.polyline([], {
        color: '#65C800',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      polylineRef.current = polyline;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update polyline and current runner marker whenever points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polyline = polylineRef.current;
    if (!map || !polyline) return;

    const latLngs: [number, number][] = points.map((p) => [p.latitude, p.longitude]);
    polyline.setLatLngs(latLngs);

    // Start point marker
    if (points.length > 0 && !startMarkerRef.current) {
      const startIcon = L.divIcon({
        className: 'custom-start-marker',
        html: `<div class="w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center"><div class="w-1.5 h-1.5 rounded-full bg-[#72D600]"></div></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      startMarkerRef.current = L.marker([points[0].latitude, points[0].longitude], {
        icon: startIcon,
      }).addTo(map);
    }

    // Active Runner pulsing marker
    const activePoint = currentPoint || (points.length > 0 ? points[points.length - 1] : null);
    if (activePoint) {
      const latLng: [number, number] = [activePoint.latitude, activePoint.longitude];

      if (!markerRef.current) {
        const runnerPulseIcon = L.divIcon({
          className: 'custom-runner-icon',
          html: `
            <div class="relative flex items-center justify-center w-8 h-8">
              <span class="absolute w-8 h-8 rounded-full bg-[#72D600]/40 animate-ping"></span>
              <span class="relative w-4 h-4 rounded-full bg-[#72D600] border-2 border-white shadow-lg"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        markerRef.current = L.marker(latLng, { icon: runnerPulseIcon }).addTo(map);
      } else {
        markerRef.current.setLatLng(latLng);
      }

      if (followRunner) {
        map.panTo(latLng, { animate: true, duration: 0.8 });
      }
    }

    // If static preview and multiple points, fit map bounds
    if (!interactive && points.length > 1) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [points, currentPoint, followRunner, interactive]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[220px]" />
      
      {/* Decorative city tag overlay */}
      <div className="absolute top-3 left-3 z-[400] pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 text-xs font-semibold text-slate-800">
        <span className="w-2 h-2 rounded-full bg-[#72D600]"></span>
        <span>Chhatrapati Sambhajinagar</span>
      </div>
    </div>
  );
};
