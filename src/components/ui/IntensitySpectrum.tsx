import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TRANSITION_SPRING } from "@/lib/design-tokens";
import type { IntensityLevel } from "@/lib/activity-framework";

export interface IntensitySpectrumProps {
  levels: IntensityLevel[];
  currentLevelId: string;
  groupCounts?: Record<string, number>;
  className?: string;
}

// Progressively darker stops from most casual to most competitive
const SPECTRUM_COLORS = [
  "#3A7A52", // gathr-amber-light (most casual)
  "#2D5F3F", // gathr-amber
  "#D4893F", // gathr-forest
  "#2C2C2C", // gathr-charcoal (most competitive)
];

function getColor(index: number, total: number): string {
  if (total === 1) return SPECTRUM_COLORS[0];
  const ratio = index / (total - 1);
  const scaledIndex = Math.round(ratio * (SPECTRUM_COLORS.length - 1));
  return SPECTRUM_COLORS[scaledIndex];
}

export function IntensitySpectrum({
  levels,
  currentLevelId,
  groupCounts,
  className,
}: IntensitySpectrumProps) {
  const sorted = [...levels].sort((a, b) => a.order - b.order);
  const activeIndex = sorted.findIndex((l) => l.id === currentLevelId);
  const activeColor = activeIndex >= 0 ? getColor(activeIndex, sorted.length) : SPECTRUM_COLORS[0];

  // Percentage offset to center the marker on the active segment
  const segmentWidth = 100 / sorted.length;
  const markerLeft = activeIndex >= 0
    ? segmentWidth * activeIndex + segmentWidth / 2
    : segmentWidth / 2;

  return (
    <div className={cn("w-full min-w-0", className)}>
      {/* Labels row — above the bar */}
      <div className="flex mb-1.5">
        {sorted.map((level, i) => {
          const isActive = level.id === currentLevelId;
          const color = getColor(i, sorted.length);
          return (
            <div
              key={level.id}
              className="flex flex-col items-center px-0.5"
              style={{ width: `${segmentWidth}%` }}
            >
              <span
                className={cn(
                  "text-[10px] leading-tight text-center truncate w-full block",
                  isActive ? "font-semibold" : "font-normal text-gathr-warm-gray",
                )}
                style={isActive ? { color } : undefined}
              >
                {level.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Animated marker (triangle pointing down at active segment) */}
      <div className="relative h-3 mb-0.5">
        <motion.div
          className="absolute -translate-x-1/2"
          style={{ left: `${markerLeft}%` }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_SPRING}
        >
          {/* Triangle marker */}
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path d="M5 7L0 0H10L5 7Z" fill={activeColor} />
          </svg>
        </motion.div>
      </div>

      {/* Segmented bar */}
      <div className="flex w-full rounded-full overflow-hidden h-3">
        {sorted.map((level, i) => {
          const isActive = level.id === currentLevelId;
          const color = getColor(i, sorted.length);
          return (
            <div
              key={level.id}
              className={cn(
                "h-full shrink-0 transition-all",
                isActive && "ring-2 ring-inset ring-white/60",
              )}
              style={{
                width: `${segmentWidth}%`,
                backgroundColor: color,
                opacity: isActive ? 1 : 0.35,
              }}
            />
          );
        })}
      </div>

      {/* Group counts row — below the bar (only when provided) */}
      {groupCounts && (
        <div className="flex mt-1.5">
          {sorted.map((level, i) => {
            const count = groupCounts[level.id];
            const isActive = level.id === currentLevelId;
            return (
              <div
                key={level.id}
                className="flex items-center justify-center px-0.5"
                style={{ width: `${segmentWidth}%` }}
              >
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      "text-[9px] leading-none text-center",
                      isActive ? "text-gathr-charcoal font-semibold" : "text-gathr-warm-gray",
                    )}
                  >
                    {count} {count === 1 ? "group" : "groups"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
