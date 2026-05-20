import { motion } from "motion/react";

type Pin = {
  id: string;
  x: number; // %
  y: number; // %
  size?: number;
  label?: string;
  going?: number;
  live?: boolean;
};

const defaultPins: Pin[] = [
  { id: "vikes", x: 38, y: 42, size: 22, label: "Vikings vs Packers", going: 47, live: true },
  { id: "trail", x: 62, y: 28, size: 16, label: "Sat trail run", going: 12 },
  { id: "park", x: 28, y: 66, size: 14, label: "Park playdate", going: 8 },
  { id: "trivia", x: 72, y: 58, size: 15, label: "Trivia @ Surly", going: 19 },
  { id: "farm", x: 50, y: 78, size: 12, label: "Farmers market", going: 6 },
  { id: "rink", x: 18, y: 38, size: 11, label: "Open skate", going: 4 },
];

export function MapCanvas({
  pins = defaultPins,
  className = "",
  showLabels = false,
}: {
  pins?: Pin[];
  className?: string;
  showLabels?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-[oklch(0.93_0.02_80)] ${className}`}>
      {/* Base map: warm cream land */}
      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.72 0.13 60)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="oklch(0.72 0.13 60)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.72 0.12 35)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.72 0.12 35)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Parks — muted sage */}
        <path d="M 480 80 Q 580 60 640 140 T 700 260 Q 660 300 580 280 T 480 200 Z"
          fill="oklch(0.78 0.05 145)" opacity="0.55" />
        <path d="M 60 380 Q 140 360 200 420 T 260 520 Q 180 540 100 500 T 60 420 Z"
          fill="oklch(0.78 0.05 145)" opacity="0.55" />

        {/* River — warm gray-blue */}
        <path d="M 0 320 Q 200 280 380 340 T 800 300 L 800 360 Q 600 380 380 360 T 0 360 Z"
          fill="oklch(0.78 0.025 220)" opacity="0.55" />

        {/* Roads — warm sandy */}
        <g stroke="oklch(0.86 0.02 75)" strokeWidth="6" fill="none" strokeLinecap="round">
          <line x1="0" y1="180" x2="800" y2="220" />
          <line x1="0" y1="460" x2="800" y2="420" />
          <line x1="180" y1="0" x2="220" y2="600" />
          <line x1="520" y1="0" x2="560" y2="600" />
        </g>
        <g stroke="oklch(0.9 0.015 75)" strokeWidth="3" fill="none">
          <line x1="0" y1="100" x2="800" y2="120" />
          <line x1="0" y1="540" x2="800" y2="520" />
          <line x1="380" y1="0" x2="400" y2="600" />
          <line x1="680" y1="0" x2="700" y2="600" />
        </g>

        {/* Heat zones */}
        <ellipse cx="320" cy="260" rx="180" ry="140" fill="url(#heat1)" />
        <ellipse cx="580" cy="380" rx="160" ry="120" fill="url(#heat2)" />
      </svg>

      {/* Pins */}
      {pins.map((p) => (
        <div
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {p.live && (
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 animate-ripple"
              style={{ width: (p.size ?? 16) * 2, height: (p.size ?? 16) * 2 }}
            />
          )}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.random() * 0.6, type: "spring", stiffness: 200, damping: 18 }}
            className="relative grid place-items-center rounded-full bg-primary text-primary-foreground shadow-warm ring-2 ring-background"
            style={{ width: p.size ?? 16, height: p.size ?? 16 }}
          >
            {p.going && p.size && p.size >= 14 && (
              <span className="text-[9px] font-semibold leading-none">{p.going}</span>
            )}
          </motion.div>
          {showLabels && p.label && (
            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-1 text-[10px] font-medium text-foreground shadow-warm-sm">
              {p.label}
            </div>
          )}
        </div>
      ))}

      {/* User location */}
      <div className="absolute left-[48%] top-[50%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-forest/20 animate-pulse-warm" />
        <span className="relative block h-3 w-3 rounded-full bg-forest ring-2 ring-background" />
      </div>
    </div>
  );
}
