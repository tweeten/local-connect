import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";
import type { MatchGroup, User, Activity } from "@/lib/activity-framework";
import { AvatarGroup } from "./AvatarGroup";
import { cn } from "@/lib/utils";

export interface GroupCardProps {
  group: MatchGroup;
  members: User[];
  activity: Activity;
  lastActivity?: string;
  unreadCount?: number;
  compact?: boolean;
  onPress?: (groupId: string) => void;
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
    if (scores.length > 0) {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      parts.push(`Avg ${avg}`);
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

export function GroupCard({
  group,
  members,
  activity,
  lastActivity,
  unreadCount = 0,
  compact = false,
  onPress,
  className,
}: GroupCardProps) {
  const timeAgo = lastActivity
    ? formatDistanceToNow(new Date(lastActivity), { addSuffix: false })
    : null;

  const avatars = members.map((m) => ({
    src: m.avatarUrl,
    initials: m.firstName.slice(0, 2).toUpperCase(),
    alt: m.firstName,
  }));

  const stats = buildStats(members, activity);

  const handlePress = onPress ? () => onPress(group.id) : undefined;

  if (compact) {
    return (
      <div className={cn("w-full active:bg-black/[0.03] transition-colors", className)}>
        <Link
          to="/group/$groupId"
          params={{ groupId: group.id }}
          onClick={handlePress}
          className="flex items-center gap-3 bg-white/80 rounded-2xl shadow-warm p-4"
        >
          <AvatarGroup avatars={avatars} max={3} size="xs" className="shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-body font-semibold text-sm text-gathr-charcoal truncate">
                {group.name}
              </p>
              {unreadCount > 0 && (
                <span
                  className="h-2 w-2 rounded-full bg-gathr-coral shrink-0"
                  aria-label={`${unreadCount} unread`}
                />
              )}
            </div>
            <p className="font-body text-xs text-gathr-warm-gray mt-0.5">
              {members.length} members
              {timeAgo && <span className="ml-2">{timeAgo}</span>}
            </p>
            {stats && (
              <p className="font-body text-xs text-gathr-warm-gray truncate">{stats}</p>
            )}
          </div>

          <ChevronRight size={16} className="text-gathr-warm-gray shrink-0" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn("shrink-0 active:bg-black/[0.03] transition-colors", className)}
      style={{ width: 280 }}
    >
      <Link
        to="/group/$groupId"
        params={{ groupId: group.id }}
        onClick={handlePress}
          className="relative block bg-white/80 rounded-2xl shadow-warm p-4 h-full"
      >
        {unreadCount > 0 && (
          <span
            className="absolute top-3 right-3 h-2 w-2 rounded-full bg-gathr-coral"
            aria-label={`${unreadCount} unread`}
          />
        )}

        {/* Top */}
        <div className="flex items-start gap-2 mb-3 pr-4">
          <p className="font-body font-semibold text-base text-gathr-charcoal flex-1 truncate leading-tight">
            {group.name}
          </p>
          <span className="shrink-0 rounded-full bg-gathr-forest/10 text-gathr-forest px-2 py-0.5 text-[10px] font-body font-semibold">
            {activity.name}
          </span>
        </div>

        {/* Middle */}
        <div className="flex items-center gap-2 mb-3">
          <AvatarGroup avatars={avatars} max={4} size="xs" />
          <span className="font-body text-xs text-gathr-warm-gray">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between gap-2">
          <p className="font-body text-xs text-gathr-warm-gray truncate flex-1">
            {stats || "\u00A0"}
          </p>
          {timeAgo && (
            <span className="font-body text-xs text-gathr-warm-gray shrink-0">
              {timeAgo}
            </span>
          )}
        </div>
        </Link>
    </div>
  );
}
