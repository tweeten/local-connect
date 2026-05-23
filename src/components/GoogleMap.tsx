import { useEffect, useRef, useState } from "react";
import { MapCanvas } from "./MapCanvas";

declare global {
  interface Window {
    google?: any;
    __gatherInitMap?: () => void;
  }
}

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  going: number;
  live?: boolean;
  time?: string;
  community?: string;
}

const PINS: MapPin[] = [
  {
    id: "vikes",
    lat: 44.9737,
    lng: -93.2581,
    label: "Vikings vs Packers tailgate",
    going: 47,
    live: true,
    time: "Sun · 1:00 PM",
    community: "Vikings Fans",
  },
  {
    id: "trail",
    lat: 44.7891,
    lng: -93.1851,
    label: "Saturday trail run",
    going: 12,
    time: "Sat · 8:00 AM",
    community: "Outdoor & Trails",
  },
  {
    id: "park",
    lat: 44.9817,
    lng: -93.1496,
    label: "Kids + coffee at the park",
    going: 8,
    time: "Sat · 10:00 AM",
    community: "Family Adventures",
  },
  {
    id: "trivia",
    lat: 44.9667,
    lng: -93.2562,
    label: "Trivia night @ Surly",
    going: 19,
    time: "Wed · 7:00 PM",
    community: "Food & Drink",
  },
  {
    id: "farm",
    lat: 44.9799,
    lng: -93.2782,
    label: "Mill City Farmers Market",
    going: 6,
    time: "Sat · 9:00 AM",
    community: "Food & Drink",
  },
  {
    id: "rink",
    lat: 44.9407,
    lng: -93.0951,
    label: "Open skate night",
    going: 4,
    time: "Fri · 7:30 PM",
    community: "Outdoor & Trails",
  },
];

// Warm-toned custom map style — cream land, muted sage parks, warm roads
const MAP_STYLE: any[] = [
  { elementType: "geometry",                      stylers: [{ color: "#f0ebe3" }] },
  { elementType: "labels.text.fill",              stylers: [{ color: "#7a7670" }] },
  { elementType: "labels.text.stroke",            stylers: [{ color: "#faf7f2" }] },
  { featureType: "administrative",     elementType: "geometry.stroke",   stylers: [{ color: "#e0d6c1" }] },
  { featureType: "landscape.natural",  elementType: "geometry",          stylers: [{ color: "#ede2c8" }] },
  { featureType: "poi",                elementType: "geometry",          stylers: [{ color: "#e6dcc2" }] },
  { featureType: "poi.park",           elementType: "geometry",          stylers: [{ color: "#d4e5d0" }] },
  { featureType: "poi.park",           elementType: "labels.text.fill",  stylers: [{ color: "#5a7a5c" }] },
  { featureType: "road",               elementType: "geometry",          stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial",      elementType: "geometry",          stylers: [{ color: "#e5dfd7" }] },
  { featureType: "road.highway",       elementType: "geometry",          stylers: [{ color: "#e5dfd7" }] },
  { featureType: "road.highway",       elementType: "geometry.stroke",   stylers: [{ color: "#d4cec4" }] },
  { featureType: "transit",            elementType: "geometry",          stylers: [{ color: "#e6dcc2" }] },
  { featureType: "water",              elementType: "geometry",          stylers: [{ color: "#c8d8dc" }] },
  { featureType: "water",              elementType: "labels.text.fill",  stylers: [{ color: "#7090a0" }] },
  { featureType: "building",           elementType: "geometry",          stylers: [{ color: "#e8e2d9" }] },
  { elementType: "labels.icon",                   stylers: [{ visibility: "off" }] },
];

// SVG pin marker — larger for clusters (10+ events), smaller for solo pins.
// Live pins include an animated expanding ring via SVG CSS keyframes.
function makePinSvg(live: boolean, going: number): string {
  // Pin sizes: cluster (48px) vs normal (36px)
  const isCluster = going >= 10;
  const outerSize  = isCluster ? 48 : 36;
  const cx = outerSize / 2;
  const r  = isCluster ? 15 : 11;

  const ringAnim = live
    ? `<style>
        @keyframes pin-ring {
          0%   { r: ${r}; opacity: 0.35; }
          100% { r: ${outerSize * 0.9}; opacity: 0; }
        }
        .pr { animation: pin-ring 2s ease-out infinite; transform-origin: ${cx}px ${cx}px; }
      </style>
      <circle class="pr" cx="${cx}" cy="${cx}" r="${r}" fill="#2D5F3F"/>`
    : "";

  const fontSize = isCluster ? 11 : 9;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${outerSize}' height='${outerSize}' viewBox='0 0 ${outerSize} ${outerSize}'>
    ${ringAnim}
    <circle cx='${cx}' cy='${cx}' r='${r + 3}' fill='#ffffff' opacity='0.9'/>
    <circle cx='${cx}' cy='${cx}' r='${r}' fill='#2D5F3F' filter='drop-shadow(0 1px 3px rgba(44,44,44,0.25))'/>
    <text x='${cx}' y='${cx + 4}' font-family='Source Sans 3, sans-serif' font-size='${fontSize}' font-weight='700' fill='#ffffff' text-anchor='middle'>${going}</text>
  </svg>`;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// Styled InfoWindow HTML content for a pin tooltip
function makeInfoWindowContent(pin: MapPin): string {
  return `
    <div style="font-family:'Source Sans 3',sans-serif;padding:2px 0;max-width:220px;min-width:160px;">
      <p style="font-weight:700;font-size:13px;color:#2C2C2C;margin:0 0 2px 0;line-height:1.3;">${pin.label}</p>
      ${pin.time ? `<p style="font-size:11px;color:#7A7670;margin:0 0 1px 0;">${pin.time}</p>` : ""}
      <p style="font-size:11px;color:#7A7670;margin:0 0 6px 0;">${pin.going} going${pin.community ? ` · ${pin.community}` : ""}</p>
      <a href="/event/${pin.id}" style="display:inline-block;font-size:11px;font-weight:700;color:#2D5F3F;text-decoration:none;">See details →</a>
    </div>
  `;
}

export function GoogleMap({
  onPinClick,
  activeId,
}: {
  onPinClick?: (id: string) => void;
  activeId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const infoWindowRef = useRef<any>(null);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null); // null = pending

  useEffect(() => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;

    if (!key) {
      setApiAvailable(false);
      return;
    }

    const init = () => {
      if (!ref.current || !window.google) return;
      setApiAvailable(true);

      const map = new window.google.maps.Map(ref.current, {
        center: { lat: 44.95, lng: -93.18 },
        zoom: 11,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        clickableIcons: false,
      });
      mapRef.current = map;

      // Shared InfoWindow (one at a time)
      infoWindowRef.current = new window.google.maps.InfoWindow({
        pixelOffset: new window.google.maps.Size(0, -4),
      });

      // User location dot — forest green with pulse ring
      new window.google.maps.Marker({
        position: { lat: 44.95, lng: -93.18 },
        map,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                <style>@keyframes loc-pulse{0%,100%{r:10;opacity:0.18;}50%{r:12;opacity:0.10;}}.lp{animation:loc-pulse 2.4s ease-in-out infinite;}</style>
                <circle class='lp' cx='12' cy='12' r='10' fill='#D4893F'/>
                <circle cx='12' cy='12' r='5' fill='#D4893F' stroke='white' stroke-width='2'/>
              </svg>`,
            ),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 12),
        },
        zIndex: 999,
      });

      PINS.forEach((p) => {
        const pinSize = p.going >= 10 ? 48 : 36;
        const marker = new window.google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          icon: {
            url: makePinSvg(!!p.live, p.going),
            scaledSize: new window.google.maps.Size(pinSize, pinSize),
            anchor: new window.google.maps.Point(pinSize / 2, pinSize / 2),
          },
          title: p.label,
          zIndex: p.live ? 100 : 50,
        });

        marker.addListener("click", () => {
          onPinClick?.(p.id);
          map.panTo({ lat: p.lat, lng: p.lng });
          // Show tooltip InfoWindow
          infoWindowRef.current.setContent(makeInfoWindowContent(p));
          infoWindowRef.current.open({ anchor: marker, map });
        });

        markersRef.current[p.id] = marker;
      });

      // Close InfoWindow when clicking the map
      map.addListener("click", () => {
        infoWindowRef.current?.close();
      });
    };

    if (window.google?.maps) {
      init();
      return;
    }

    window.__gatherInitMap = init;
    const scriptId = "gather-gmaps";
    if (document.getElementById(scriptId)) return;
    const s = document.createElement("script");
    s.id = scriptId;
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__gatherInitMap${channel ? `&channel=${channel}` : ""}`;
    s.onerror = () => setApiAvailable(false);
    document.head.appendChild(s);
  }, [onPinClick]);

  // Pan to active pin when activeId changes externally (e.g. hovering event card)
  useEffect(() => {
    if (!mapRef.current || !activeId) return;
    const pin = PINS.find((p) => p.id === activeId);
    if (pin) mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
  }, [activeId]);

  // If we're still loading (null) show a warm placeholder
  if (apiAvailable === false) {
    return <MapCanvas className="h-full w-full" showLabels />;
  }

  return (
    <div className="relative h-full w-full">
      <div ref={ref} className="h-full w-full" />
      {/* While Google Maps script loads, show MapCanvas behind it */}
      {apiAvailable === null && (
        <div className="absolute inset-0">
          <MapCanvas className="h-full w-full" />
        </div>
      )}
    </div>
  );
}

export { PINS as MAP_PINS };
