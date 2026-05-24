import { useState } from "react";
import { cn } from "@/lib/utils";

export interface GathrAvatarProps {
  src?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg";
  online?: boolean;
  className?: string;
  alt?: string;
}

const sizeMap = {
  xs: { dim: 32, text: "text-[10px]", dot: "h-2.5 w-2.5", dotRing: "ring-[1.5px]" },
  sm: { dim: 40, text: "text-xs",     dot: "h-3 w-3",     dotRing: "ring-2" },
  md: { dim: 56, text: "text-sm",     dot: "h-3.5 w-3.5", dotRing: "ring-2" },
  lg: { dim: 80, text: "text-base",   dot: "h-4 w-4",     dotRing: "ring-2" },
};

export function GathrAvatar({
  src,
  initials = "?",
  size = "md",
  online,
  className,
  alt = "",
}: GathrAvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const { dim, text, dot, dotRing } = sizeMap[size];

  return (
    <div
      role="img"
      aria-label={alt || initials}
      className={cn("relative shrink-0 rounded-full ring-2 ring-gathr-cream", className)}
      style={{ width: dim, height: dim }}
    >
      {/* Amber fallback */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-full bg-gathr-forest font-semibold text-white select-none",
          text,
        )}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Image crossfade */}
      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full rounded-full object-cover transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Online indicator */}
      {online && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-gathr-sage ring-gathr-cream",
            dot,
            dotRing,
          )}
        />
      )}
    </div>
  );
}
