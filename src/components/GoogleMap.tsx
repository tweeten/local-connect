import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
    __gatherInitMap?: () => void;
  }
}

const PINS = [
  { id: "vikes", lat: 44.9737, lng: -93.2581, label: "Vikings tailgate", going: 47, live: true },
  { id: "trail", lat: 44.7891, lng: -93.1851, label: "Lebanon Hills trail run", going: 12 },
  { id: "park", lat: 44.9817, lng: -93.1496, label: "Como park playdate", going: 8 },
  { id: "trivia", lat: 44.9667, lng: -93.2562, label: "Trivia @ Surly", going: 19 },
  { id: "farm", lat: 44.9799, lng: -93.2782, label: "Farmers market", going: 6 },
  { id: "rink", lat: 44.9407, lng: -93.0951, label: "Open skate", going: 4 },
];

// Warm-toned custom map style — cream land, muted sage parks, warm roads
const MAP_STYLE: any[] = [
  { elementType: "geometry", stylers: [{ color: "#f4ecdc" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7a7670" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#faf7f2" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#e0d6c1" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#ede2c8" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e6dcc2" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#cfdcc2" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#5a7a5c" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#f7eed8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f0c98a" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e0b070" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e6dcc2" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9dde0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#7090a0" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
];

function makePinIcon(live: boolean, going: number) {
  const size = going >= 30 ? 44 : going >= 15 ? 38 : 32;
  const ringOpacity = live ? 0.35 : 0;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 44 44'>
    <circle cx='22' cy='22' r='20' fill='#d4893f' opacity='${ringOpacity}'/>
    <circle cx='22' cy='22' r='13' fill='#ffffff'/>
    <circle cx='22' cy='22' r='11' fill='#d4893f'/>
    <text x='22' y='26' font-family='Source Sans 3, sans-serif' font-size='10' font-weight='700' fill='#ffffff' text-anchor='middle'>${going}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

export function GoogleMap({
  onPinClick,
  activeId,
}: {
  onPinClick?: (id: string) => void;
  activeId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) {
      setError("Map unavailable");
      return;
    }

    const init = () => {
      if (!ref.current || !window.google) return;
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

      // User location dot
      new window.google.maps.Marker({
        position: { lat: 44.95, lng: -93.18 },
        map,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'><circle cx='11' cy='11' r='10' fill='#2D5F3F' opacity='0.2'/><circle cx='11' cy='11' r='5' fill='#2D5F3F' stroke='white' stroke-width='2'/></svg>`,
            ),
          scaledSize: new window.google.maps.Size(22, 22),
          anchor: new window.google.maps.Point(11, 11),
        },
        zIndex: 999,
      });

      PINS.forEach((p) => {
        const marker = new window.google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          icon: {
            url: makePinIcon(!!p.live, p.going),
            scaledSize: new window.google.maps.Size(44, 44),
            anchor: new window.google.maps.Point(22, 22),
          },
          title: p.label,
        });
        marker.addListener("click", () => {
          onPinClick?.(p.id);
          map.panTo({ lat: p.lat, lng: p.lng });
        });
        markersRef.current[p.id] = marker;
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
    s.onerror = () => setError("Map failed to load");
    document.head.appendChild(s);
  }, [onPinClick]);

  // Highlight active pin
  useEffect(() => {
    if (!mapRef.current || !activeId) return;
    const pin = PINS.find((p) => p.id === activeId);
    if (pin) mapRef.current.panTo({ lat: pin.lat, lng: pin.lng });
  }, [activeId]);

  return (
    <div className="relative h-full w-full">
      <div ref={ref} className="h-full w-full" />
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground">
          {error}
        </div>
      )}
    </div>
  );
}

export { PINS as MAP_PINS };
