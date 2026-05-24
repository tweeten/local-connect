import { GathrAvatar, type GathrAvatarProps } from "./GathrAvatar";
import { cn } from "@/lib/utils";

export interface AvatarGroupItem
  extends Pick<GathrAvatarProps, "src" | "initials" | "online" | "alt"> {}

export interface AvatarGroupProps {
  avatars: AvatarGroupItem[];
  max?: number;
  size?: GathrAvatarProps["size"];
  className?: string;
}

const sizeMap = {
  xs: { dim: 32, text: "text-[10px]" },
  sm: { dim: 40, text: "text-xs" },
  md: { dim: 56, text: "text-sm" },
  lg: { dim: 80, text: "text-base" },
};

export function AvatarGroup({
  avatars,
  max = 4,
  size = "sm",
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  const { dim, text } = sizeMap[size];

  return (
    <div className={cn("flex items-center", className)}>
      {visible.map((a, i) => (
        <div
          key={i}
          style={{ marginLeft: i === 0 ? 0 : -8, zIndex: visible.length - i }}
        >
          <GathrAvatar {...a} size={size} />
        </div>
      ))}

      {overflow > 0 && (
        <div
          style={{ marginLeft: -8, zIndex: 0, width: dim, height: dim }}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-gathr-forest font-semibold text-white ring-2 ring-gathr-cream",
            text,
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
