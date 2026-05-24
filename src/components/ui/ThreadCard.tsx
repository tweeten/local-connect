import { MessageSquare, ArrowUp } from "lucide-react";
import { GathrAvatar, type GathrAvatarProps } from "./GathrAvatar";
import { cn } from "@/lib/utils";

export interface ThreadCardProps {
  id: string;
  poster: Pick<GathrAvatarProps, "src" | "initials">;
  posterName: string;
  title: string;
  preview: string;
  replyCount: number;
  timestamp: string;
  upvotes?: number;
  upvoted?: boolean;
  onPress?: (id: string) => void;
  onUpvote?: (id: string) => void;
  className?: string;
}

export function ThreadCard({
  id,
  poster,
  posterName,
  title,
  preview,
  replyCount,
  timestamp,
  upvotes,
  upvoted = false,
  onPress,
  onUpvote,
  className,
}: ThreadCardProps) {
  return (
    <div
      onClick={() => onPress?.(id)}
      className={cn(
        "flex gap-3 bg-white/80 rounded-2xl shadow-warm p-4 cursor-pointer active:bg-black/[0.03] transition-colors",
        className,
      )}
    >
      {/* Avatar column */}
      <GathrAvatar {...poster} size="sm" className="mt-0.5 shrink-0" />

      {/* Content column */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-sm text-gathr-charcoal">{posterName}</p>
        <p className="font-body font-medium text-base text-gathr-charcoal mt-0.5 leading-snug">
          {title}
        </p>
        <p className="text-sm text-gathr-warm-gray mt-1 line-clamp-2 leading-snug">
          {preview}
        </p>

        {/* Footer row */}
        <div className="mt-2 flex items-center gap-3 text-xs text-gathr-warm-gray">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </span>
          <span>{timestamp}</span>

          {upvotes !== undefined && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpvote?.(id);
              }}
              className={cn(
                "ml-auto flex items-center gap-1 transition-colors",
                upvoted ? "text-gathr-forest" : "text-gathr-warm-gray hover:text-gathr-forest",
              )}
              aria-label="Upvote thread"
            >
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2} />
              {upvotes}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
