// Not currently used in any route. Retained for future use.
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface GathrSkeletonProps {
  variant?: "text" | "avatar" | "card" | "thread";
  width?: string;
  className?: string;
}

function Block({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("animate-shimmer-warm rounded-card-sm", className)}
      style={style}
    />
  );
}

/** Single text line */
function TextSkeleton({ width = "100%", className }: { width?: string; className?: string }) {
  return <Block className={cn("h-4 rounded", className)} style={{ width } as React.CSSProperties} />;
}

/** Circular avatar */
function AvatarSkeleton({ className }: { className?: string }) {
  return <Block className={cn("h-10 w-10 rounded-full shrink-0", className)} />;
}

/** Full EventCard-shaped skeleton */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-gathr-cream-dark rounded-card-lg shadow-warm p-4 space-y-3", className)}>
      {/* Top row */}
      <div className="flex justify-between">
        <Block className="h-5 w-16 rounded-full" />
        <Block className="h-4 w-20 rounded" />
      </div>
      {/* Title */}
      <Block className="h-6 w-3/4 rounded" />
      {/* Location */}
      <Block className="h-4 w-1/2 rounded" />
      {/* Avatars */}
      <div className="flex gap-2 items-center">
        {[0, 1, 2].map((i) => (
          <Block key={i} className="h-8 w-8 rounded-full" style={{ marginLeft: i === 0 ? 0 : -8 } as React.CSSProperties} />
        ))}
        <Block className="h-4 w-16 rounded ml-2" />
      </div>
      {/* CTA */}
      <Block className="h-10 w-28 rounded-full" />
    </div>
  );
}

/** ThreadCard-shaped skeleton */
function ThreadSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-3 bg-gathr-cream-dark rounded-card-sm shadow-warm p-4", className)}>
      <AvatarSkeleton />
      <div className="flex-1 space-y-2">
        <Block className="h-4 w-24 rounded" />
        <Block className="h-5 w-full rounded" />
        <Block className="h-4 w-3/4 rounded" />
        <div className="flex gap-3 pt-1">
          <Block className="h-3.5 w-16 rounded" />
          <Block className="h-3.5 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}

export function GathrSkeleton({ variant = "text", width, className }: GathrSkeletonProps) {
  switch (variant) {
    case "avatar":
      return <AvatarSkeleton className={className} />;
    case "card":
      return <CardSkeleton className={className} />;
    case "thread":
      return <ThreadSkeleton className={className} />;
    default:
      return <TextSkeleton width={width} className={className} />;
  }
}
