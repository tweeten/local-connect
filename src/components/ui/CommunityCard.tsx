// Not currently used in any route. Retained for future use.
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Check } from "lucide-react";
import { GathrButton } from "./GathrButton";
import { TRANSITION_DEFAULT } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type AccentColor = "amber" | "sage" | "coral" | "terracotta" | "dusty-blue";

const accentColorMap: Record<AccentColor, string> = {
  amber: "bg-gathr-forest",
  sage: "bg-gathr-sage",
  coral: "bg-gathr-coral",
  terracotta: "bg-gathr-terracotta",
  "dusty-blue": "bg-gathr-dusty-blue",
};

export interface CommunityCardProps {
  id: string;
  name: string;
  memberCount: number;
  activity: string;
  activityType: "event" | "conversation";
  accent?: AccentColor;
  suggested?: boolean;
  /** Contextual line shown below activity on suggested cards */
  suggestionLine?: string;
  /** When true, shows checkmark and glow — card is mid-join animation */
  joining?: boolean;
  onPress?: (id: string) => void;
  onJoin?: (id: string) => void;
  className?: string;
}

export function CommunityCard({
  id,
  name,
  memberCount,
  activity,
  activityType,
  accent = "amber",
  suggested = false,
  suggestionLine,
  joining = false,
  onPress,
  onJoin,
  className,
}: CommunityCardProps) {
  return (
    <div
      onClick={() => onPress?.(id)}
      className={cn(
        "flex overflow-hidden rounded-2xl shadow-warm cursor-pointer active:bg-black/[0.03] transition-colors",
        suggested && !joining && "opacity-85",
        className,
      )}
    >
      {/* Left accent bar */}
      <div
          className={cn(
          "w-1 shrink-0 rounded-l-2xl",
          accentColorMap[accent],
          suggested && !joining && "opacity-50",
        )}
      />

      {/* Content */}
      <div className="flex flex-1 items-center gap-3 bg-white/80 p-4">
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-gathr-charcoal truncate">{name}</p>
          <p className="text-sm text-gathr-warm-gray mt-0.5">
            {memberCount.toLocaleString()} members
          </p>
          <p
            className={cn(
              "text-sm mt-1 truncate",
              activityType === "event" ? "text-gathr-coral" : "text-gathr-warm-gray",
            )}
          >
            {activity}
          </p>
          {suggested && suggestionLine && (
            <p className="text-xs text-gathr-warm-gray mt-1 truncate italic">
              {suggestionLine}
            </p>
          )}
        </div>

        {suggested ? (
          <AnimatePresence mode="wait" initial={false}>
            {joining ? (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={TRANSITION_DEFAULT}
                className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gathr-sage"
              >
                <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="join"
                initial={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={TRANSITION_DEFAULT}
              >
                <GathrButton
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoin?.(id);
                  }}
                  className="shrink-0"
                >
                  Join
                </GathrButton>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <ChevronRight
            className="h-5 w-5 shrink-0 text-gathr-warm-gray"
            strokeWidth={1.75}
          />
        )}
      </div>
    </div>
  );
}
