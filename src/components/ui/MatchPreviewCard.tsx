import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import type { MatchGroup, User, Activity } from "@/lib/activity-framework";
import { AvatarGroup } from "./AvatarGroup";
import { GathrButton } from "./GathrButton";
import { CARD_PRESS, TRANSITION_SPRING } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export interface MatchPreviewCardProps {
  group: MatchGroup;
  members: User[];
  activity: Activity;
  slotsRemaining: number;
  compatibilityScore?: number;
  onJoin?: (groupId: string) => void;
  className?: string;
}

function buildStats(members: User[], activity: Activity): string {
  const profiles = members
    .map((m) => m.activityProfiles.find((p) => p.activityId === activity.id))
    .filter(Boolean);

  const parts: string[] = [];

  const scoreField = activity.profileFields.find((f) => f.id === "skill-level");
  if (scoreField && profiles.length > 0) {
    const scores = profiles
      .map((p) => Number(p!.fieldValues["skill-level"]))
      .filter((n) => !isNaN(n) && n > 0);
    if (scores.length >= 2) {
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      parts.push(min === max ? `${min}` : `${min}–${max}`);
    } else if (scores.length === 1) {
      parts.push(`${scores[0]}`);
    }
  }

  const freq = profiles[0]?.frequencyGoal;
  if (freq) parts.push(freq);

  const intensityId = profiles[0]?.intensityLevel;
  if (intensityId) {
    const level = activity.intensityLevels.find((l) => l.id === intensityId);
    if (level) parts.push(level.label);
  }

  return parts.join(" · ");
}

export function MatchPreviewCard({
  group,
  members,
  activity,
  slotsRemaining,
  compatibilityScore,
  onJoin,
  className,
}: MatchPreviewCardProps) {
  const [joined, setJoined] = useState(false);

  function handleJoin(e: React.MouseEvent) {
    e.stopPropagation();
    if (joined) return;
    setJoined(true);
    onJoin?.(group.id);
  }

  const avatars = members.map((m) => ({
    src: m.avatarUrl,
    initials: m.firstName.slice(0, 2).toUpperCase(),
    alt: m.firstName,
  }));

  const memberNames = members.map((m) => m.firstName).join(", ");
  const stats = buildStats(members, activity);

  return (
    <motion.div
      whileTap={CARD_PRESS.whileTap}
      transition={CARD_PRESS.transition}
      className={cn(
        "bg-gathr-cream-dark rounded-card-lg shadow-warm ring-1 ring-gathr-warm-gray-light/40 p-4",
        className,
      )}
    >
      {/* Top badge */}
      <div>
        <span className="rounded-full bg-gathr-coral/15 text-gathr-coral text-xs font-semibold px-2.5 py-0.5">
          Looking for {slotsRemaining} more
        </span>
      </div>

      {/* Group stats */}
      {stats && (
        <p className="mt-3 font-body text-sm text-gathr-warm-gray">
          Scores {stats}
        </p>
      )}

      {/* Member avatars + names */}
      <div className="mt-3 flex items-center gap-2">
        <AvatarGroup avatars={avatars} size="xs" max={4} />
        {memberNames && (
          <span className="font-body text-xs text-gathr-warm-gray truncate">
            {memberNames}
          </span>
        )}
      </div>

      {/* Compatibility score */}
      {compatibilityScore !== undefined && (
        <p className="mt-2 font-body text-sm font-semibold text-gathr-forest">
          {compatibilityScore}% match
        </p>
      )}

      {/* Join CTA */}
      <div className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          {joined ? (
            <motion.div
              key="joined"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={TRANSITION_SPRING}
            >
              <GathrButton
                variant="secondary"
                size="sm"
                onClick={handleJoin}
                className="gap-1.5 text-gathr-forest border-gathr-forest"
              >
                <Check className="h-4 w-4" strokeWidth={2} />
                You're in
              </GathrButton>
            </motion.div>
          ) : (
            <motion.div
              key="join"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={TRANSITION_SPRING}
            >
              <GathrButton variant="primary" size="sm" onClick={handleJoin}>
                I'm in
              </GathrButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
