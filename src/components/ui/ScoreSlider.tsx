import { useRef, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ScoreSliderZone {
  min: number;
  max: number;
  label: string;
  color: string;
}

export interface ScoreSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  zones: ScoreSliderZone[];
  className?: string;
}

export function ScoreSlider({
  min,
  max,
  value,
  onChange,
  zones,
  className,
}: ScoreSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const totalRange = max - min;

  const valueToPercent = (v: number) => ((v - min) / totalRange) * 100;

  const positionToValue = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * totalRange;
      return Math.round(raw);
    },
    [min, totalRange, value],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onChange(positionToValue(e.clientX));
    },
    [onChange, positionToValue],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      onChange(positionToValue(e.clientX));
    },
    [onChange, positionToValue],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Allow keyboard navigation for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        onChange(Math.min(max, value + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        onChange(Math.max(min, value - 1));
      }
    },
    [min, max, value, onChange],
  );

  const thumbPercent = valueToPercent(value);

  // Find active zone for thumb color
  const activeZone = zones.find((z) => value >= z.min && value <= z.max) ?? zones[zones.length - 1];

  return (
    <div className={cn("select-none", className)}>
      {/* Track area — pointer events handled here */}
      <div
        ref={trackRef}
        className="relative h-10 flex items-center cursor-pointer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Zone segments */}
        <div className="relative w-full h-3 rounded-full overflow-hidden flex">
          {zones.map((zone) => {
            const widthPct = ((zone.max - zone.min + 1) / totalRange) * 100;
            return (
              <div
                key={zone.label}
                className="h-full shrink-0"
                style={{ width: `${widthPct}%`, backgroundColor: zone.color, opacity: 0.35 }}
              />
            );
          })}
          {/* Active fill overlay up to thumb */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-none"
            style={{
              width: `${thumbPercent}%`,
              backgroundColor: activeZone.color,
              opacity: 0.8,
            }}
          />
        </div>

        {/* Thumb */}
        <motion.div
          className="absolute z-10 flex items-center justify-center rounded-full border-2 border-white shadow-warm-sm font-semibold text-white text-xs leading-none"
          style={{
            left: `${thumbPercent}%`,
            transform: "translateX(-50%)",
            backgroundColor: activeZone.color,
            width: 36,
            height: 36,
            top: "50%",
            marginTop: -18,
          }}
          whileTap={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          {value}
        </motion.div>
      </div>

      {/* Zone labels */}
      <div className="relative flex mt-3">
        {zones.map((zone) => {
          const widthPct = ((zone.max - zone.min + 1) / totalRange) * 100;
          const isActive = value >= zone.min && value <= zone.max;
          return (
            <div
              key={zone.label}
              className="flex flex-col items-center"
              style={{ width: `${widthPct}%` }}
            >
              <span
                className={cn(
                  "text-[10px] font-semibold text-center leading-tight transition-colors",
                  isActive ? "text-gathr-charcoal" : "text-gathr-warm-gray",
                )}
                style={isActive ? { color: activeZone.color } : undefined}
              >
                {zone.label}
              </span>
              <span className="text-[9px] text-gathr-warm-gray mt-0.5">
                {zone.min}–{zone.max}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
