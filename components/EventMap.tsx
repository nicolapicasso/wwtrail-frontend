// components/EventMap.tsx
// Mapa interactivo con Leaflet para página de evento
// ✅ Pin principal del evento
// ✅ Pines secundarios de eventos cercanos
// ✅ Popup con información

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event } from '@/types/api';

// Fix para iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface EventMapProps {
  event: Event;
  nearbyEvents?: Event[];
}

export default function EventMap({ event, nearbyEvents = [] }: EventMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !event.latitude || !event.longitude) return;

    // Evitar reinicializar si ya existe
    if (mapRef.current) return;

    // Inicializar mapa
    const map = L.map(mapContainerRef.current).setView(
      [event.latitude, event.longitude],
      12 // zoom level
    );

    mapRef.current = map;

    // Agregar capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // ============================================
    // ✅ ICONO PERSONALIZADO PARA EVENTO PRINCIPAL
    // ============================================
    const mainIcon = L.divIcon({
      className: 'custom-marker-main',
      html: `
        <div style="
          background-color: #16a34a;
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 20px;
            font-weight: bold;
          ">📍</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    // ============================================
    // ✅ ICONO PARA EVENTOS CERCANOS
    // ============================================
    const nearbyIcon = L.divIcon({
      className: 'custom-marker-nearby',
      html: `
        <div style="
          background-color: #3b82f6;
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 14px;
          ">📌</div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });

    // ============================================
    // 📍 MARKER PRINCIPAL (Evento actual)
    // ============================================
    const mainMarker = L.marker([event.latitude, event.longitude], {
      icon: mainIcon,
      title: event.name,
    }).addTo(map);

    // Popup del evento principal
    mainMarker.bindPopup(`
      <div style="min-width: 200px;">
        <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #16a34a;">
          ${event.name}
        </h3>
        <p style="font-size: 14px; color: #666; margin-bottom: 4px;">
          📍 ${event.city}, ${event.country}
        </p>
        ${event.type ? `<p style="font-size: 12px; color: #888;">Tipo: ${event.type}</p>` : ''}
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
          <a 
            href="/events/${event.slug}" 
            style="color: #16a34a; text-decoration: none; font-weight: 600; font-size: 13px;"
          >
            Ver detalles →
          </a>
        </div>
      </div>
    `);

    // ============================================
    // 📌 MARKERS DE EVENTOS CERCANOS
    // ============================================
    nearbyEvents.forEach((nearbyEvent) => {
      if (!nearbyEvent.latitude || !nearbyEvent.longitude) return;

      const nearbyMarker = L.marker(
        [nearbyEvent.latitude, nearbyEvent.longitude],
        {
          icon: nearbyIcon,
          title: nearbyEvent.name,
        }
      ).addTo(map);

      // Popup de evento cercano
      nearbyMarker.bindPopup(`
        <div style="min-width: 180px;">
          <h4 style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: #3b82f6;">
            ${nearbyEvent.name}
          </h4>
          <p style="font-size: 12px; color: #666; margin-bottom: 4px;">
            📍 ${nearbyEvent.city}, ${nearbyEvent.country}
          </p>
          ${nearbyEvent.type ? `<p style="font-size: 11px; color: #888;">Tipo: ${nearbyEvent.type}</p>` : ''}
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #eee;">
            <a 
              href="/events/${nearbyEvent.slug}" 
              style="color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 12px;"
            >
              Ver evento →
            </a>
          </div>
        </div>
      `);
    });

    // ============================================
    // 🗺️ AJUSTAR VISTA PARA MOSTRAR TODOS LOS MARKERS
    // ============================================
    if (nearbyEvents.length > 0) {
      const bounds = L.latLngBounds([
        [event.latitude, event.longitude],
        ...nearbyEvents
          .filter(e => e.latitude && e.longitude)
          .map(e => [e.latitude!, e.longitude!] as [number, number])
      ]);
      
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [event, nearbyEvents]);

  if (!event.latitude || !event.longitude) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Ubicación no disponible</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef} 
      className="h-64 rounded-lg overflow-hidden border border-gray-200"
      style={{ zIndex: 0 }}
    />
  );
}

/*
✅ CARACTERÍSTICAS:

1. PIN PRINCIPAL (Verde):
   - Evento actual
   - Más grande y destacado
   - Popup con información completa

2. PINES SECUNDARIOS (Azules):
   - Eventos cercanos (50km radius)
   - Más pequeños
   - Popup con link al evento

3. FUNCIONALIDADES:
   - Auto-zoom para mostrar todos los eventos
   - Click en markers para ver info
   - Links directos a eventos
   - Responsive

4. INTEGRACIÓN:
   - OpenStreetMap (gratuito, sin API key)
   - Leaflet (biblioteca ligera)
   - Iconos personalizados con emoji

INSTALACIÓN REQUERIDA:
npm install leaflet
npm install --save-dev @types/leaflet
*/
