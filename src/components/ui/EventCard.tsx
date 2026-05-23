import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Check } from "lucide-react";
import { AvatarGroup, type AvatarGroupItem } from "./AvatarGroup";
import { GathrButton } from "./GathrButton";
import { CARD_PRESS, TRANSITION_SPRING } from "@/lib/design-tokens";
import { useGathr } from "@/lib/GathrContext";
import { cn } from "@/lib/utils";

export interface EventCardProps {
  id: string;
  name: string;
  location: string;
  dateTime: string;
  going: number;
  community?: string;
  soon?: boolean;
  attendees?: AvatarGroupItem[];
  onPress?: (id: string) => void;
  className?: string;
}

export function EventCard({
  id,
  name,
  location,
  dateTime,
  going,
  community,
  soon,
  attendees = [],
  onPress,
  className,
}: EventCardProps) {
  const { state, toggleAttendance } = useGathr();
  // For real events wired to context, use persisted state. For previews (id="preview"), use local state.
  const contextEvent = state.events.find((e) => e.id === id);
  const [localGoing, setLocalGoing] = useState(false);
  const isGoing = contextEvent ? contextEvent.isAttending : localGoing;

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (contextEvent) {
      toggleAttendance(id);
    } else {
      setLocalGoing((v) => !v);
    }
  }

  return (
    <motion.div
      whileTap={CARD_PRESS.whileTap}
      transition={CARD_PRESS.transition}
      onClick={() => onPress?.(id)}
      className={cn(
        "bg-gathr-cream-dark rounded-card-lg shadow-warm p-4 cursor-pointer",
        className,
      )}
    >
      {/* Row 1: Pills + date */}
      <div className="flex items-center justify-between gap-2 min-h-[24px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {soon && (
            <span className="rounded-full bg-gathr-coral px-2.5 py-0.5 text-xs font-semibold text-white">
              Soon
            </span>
          )}
          {community && (
            <span className="rounded-full border border-gathr-warm-gray-light bg-gathr-cream px-2.5 py-0.5 text-xs text-gathr-charcoal">
              {community}
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs text-gathr-warm-gray">{dateTime}</span>
      </div>

      {/* Row 2: Event name */}
      <h3 className="mt-2 font-body font-semibold text-lg text-gathr-charcoal leading-snug">
        {name}
      </h3>

      {/* Row 3: Location */}
      <div className="mt-1.5 flex items-center gap-1 text-sm text-gathr-warm-gray">
        <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{location}</span>
      </div>

      {/* Row 4: Attendees */}
      <div className="mt-3 flex items-center gap-2">
        <AvatarGroup avatars={attendees} size="xs" max={4} />
        <span className="text-sm text-gathr-warm-gray">{going} going</span>
      </div>

      {/* Row 5: CTA */}
      <div className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          {isGoing ? (
            <motion.div
              key="going"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={TRANSITION_SPRING}
            >
              <GathrButton
                variant="secondary"
                size="sm"
                onClick={handleToggle}
                className="gap-1.5 text-gathr-forest border-gathr-forest"
              >
                <Check className="h-4 w-4" strokeWidth={2} />
                You're going
              </GathrButton>
            </motion.div>
          ) : (
            <motion.div
              key="cta"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={TRANSITION_SPRING}
            >
              <GathrButton
                variant="primary"
                size="sm"
                onClick={handleToggle}
              >
                Count me in
              </GathrButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
