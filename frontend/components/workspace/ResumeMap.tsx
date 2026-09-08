'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Atasi masalah window is not defined pada Next.js SSR
const customIcon = typeof window !== 'undefined' ? L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [22, 35],
  iconAnchor: [11, 35],
}) : null;

// Terima props `pins` dari database
export default function ResumeMap({ pins = [] }: { pins?: any[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !customIcon) {
    return (
      <div className="h-64 w-full rounded-none overflow-hidden border border-white/10 z-0 bg-[#09090b] flex items-center justify-center font-mono text-[9px] text-white/50 tracking-widest uppercase">
        INITIALIZING TOPOGRAPHY<span className="animate-pulse text-cyan-400 ml-1">_</span>
      </div>
    );
  }

  // Jika di database tidak ada pin, pakai ini sebagai fallback bawaan
  const activePins = pins && pins.length > 0 ? pins : [
    { lat: -6.23, lng: 106.99, title: "BEKASI HQ", desc: "Pusat Operasional Utama" },
    { lat: -6.60, lng: 106.80, title: "WEST JAVA HIGHLANDS", desc: "Data Center Cadangan" }
  ];

  // Pusatkan peta di kordinat pin pertama
  const centerPosition: [number, number] = [activePins[0].lat, activePins[0].lng];

  return (
    <div className="h-64 w-full rounded-none overflow-hidden border border-white/10 z-0 bg-[#09090b]">
      <MapContainer 
        center={centerPosition} 
        zoom={8} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        ref={(map) => {
          if (map) {
            setTimeout(() => { map.invalidateSize(); }, 100);
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution="Map data: &copy; OpenStreetMap contributors | Map style: &copy; OpenTopoMap (CC-BY-SA)"
          maxZoom={17}
        />
        
        {/* Looping titik pin dari database */}
        {activePins.map((pin, i) => (
          <Marker key={i} position={[pin.lat, pin.lng]} icon={customIcon}>
            <Popup className="font-mono uppercase">
              <strong className="text-xs">{pin.title}</strong>
              {pin.desc && (
                <>
                  <br />
                  <span className="text-[9px] text-black/70 mt-1 block leading-relaxed">{pin.desc}</span>
                </>
              )}
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}