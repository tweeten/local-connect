import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  TopBar,
  SectionHeader,
  EmptyState,
  GathrButton,
  AvatarGroup,
} from "@/components/ui";
import { useGathr, useUserProfile } from "@/lib/GathrContext";
import { USERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { IntensityLevel, MatchGroup } from "@/lib/activity-framework";

export const Route = createFileRoute("/_app/activity/$activitySlug")({
  component: ActivityComponent,
  head: () => ({ meta: [{ title: "Gathr — Activity" }] }),
});

// ─── Intensity Spectrum ───────────────────────────────────────────────────────

const SPECTRUM_COLORS = [
  "bg-gathr-amber/25",
  "bg-gathr-amber/45",
  "bg-gathr-amber/70",
  "bg-gathr-amber",
];

const SPECTRUM_TEXT_COLORS = [
  "text-gathr-amber/60",
  "text-gathr-amber/75",
  "text-gathr-amber/90",
  "text-gathr-amber",
];

interface IntensitySpectrumProps {
  levels: IntensityLevel[];
  userLevelId: string | undefined;
  groupCountsByLevel: Record<string, number>;
}

function IntensitySpectrum({
  levels,
  userLevelId,
  groupCountsByLevel,
}: IntensitySpectrumProps) {
  const sorted = [...levels].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white/80 rounded-2xl shadow-warm p-4">
      <div className="flex gap-1 mb-3">
        {sorted.map((level, i) => (
          <div key={level.id} className="flex-1 relative">
            <div
              className={cn(
                "h-3 rounded-full transition-all",
                SPECTRUM_COLORS[i] ?? "bg-gathr-amber/25",
                userLevelId === level.id && "ring-2 ring-offset-1 ring-gathr-amber",
              )}
            />
            {userLevelId === level.id && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                <div className="w-2 h-2 rounded-full bg-gathr-charcoal" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        {sorted.map((level, i) => (
          <div key={level.id} className="flex-1 text-center">
            <p
              className={cn(
                "font-body text-[10px] font-semibold leading-tight truncate",
                userLevelId === level.id
                  ? "text-gathr-charcoal"
                  : (SPECTRUM_TEXT_COLORS[i] ?? "text-gathr-amber/60"),
              )}
            >
              {level.label}
            </p>
            <p className="font-body text-[10px] text-gathr-warm-gray mt-0.5">
              {groupCountsByLevel[level.id] ?? 0} group
              {(groupCountsByLevel[level.id] ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Discover card ────────────────────────────────────────────────────────────

interface DiscoverCardProps {
  group: MatchGroup;
  idealSize: number;
  onJoin: () => void;
}

function DiscoverCard({ group, idealSize, onJoin }: DiscoverCardProps) {
  const spotsLeft = Math.max(idealSize - group.memberIds.length, 1);

  // Derive member golf profiles
  const memberProfiles = group.memberIds.flatMap((uid) => {
    const user = USERS.find((u) => u.id === uid);
    return user?.activityProfiles.filter((p) => p.activityId === group.activityId) ?? [];
  });

  const scores = memberProfiles
    .map((p) => p.fieldValues["skill-level"] as number | undefined)
    .filter((s): s is number => typeof s === "number");

  const avgScore =
    scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  const intensityId = memberProfiles[0]?.intensityLevel;

  const frequencyGoals = memberProfiles
    .map((p) => p.frequencyGoal)
    .filter(Boolean);
  const frequency = frequencyGoals[0] ?? null;

  const members = group.memberIds.map((uid) => {
    const u = USERS.find((x) => x.id === uid);
    return u
      ? { initials: u.firstName.slice(0, 2).toUpperCase(), alt: u.firstName }
      : { initials: "?", alt: "Unknown" };
  });

  return (
    <div className="bg-white/80 rounded-2xl shadow-warm p-4 mb-3 active:bg-black/[0.03] transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-base text-gathr-charcoal truncate">
            {group.name}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {avgScore !== null && (
              <span className="font-body text-xs text-gathr-warm-gray">
                Avg score: {avgScore}
              </span>
            )}
            {frequency && (
              <span className="font-body text-xs text-gathr-warm-gray">
                · {frequency}
              </span>
            )}
            {intensityId && (
              <span className="font-body text-xs text-gathr-warm-gray capitalize">
                · {intensityId.replace(/-/g, " ")}
              </span>
            )}
          </div>
        </div>
        <span className="ml-2 shrink-0 px-2 py-0.5 rounded-full font-body text-[10px] font-semibold bg-gathr-amber/15 text-gathr-amber">
          Looking for {spotsLeft} more
        </span>
      </div>

      {/* Members + match */}
      <div className="flex items-center justify-between mb-3">
        <AvatarGroup avatars={members} max={4} size="xs" />
        <span className="font-body text-xs font-semibold text-gathr-forest">
          92% match
        </span>
      </div>

      <GathrButton variant="primary" size="sm" className="w-full" onClick={onJoin}>
        I'm in
      </GathrButton>
    </div>
  );
}

// ─── ActivityComponent ────────────────────────────────────────────────────────

function ActivityComponent() {
  const { activitySlug } = Route.useParams();
  const { state, joinGroup } = useGathr();
  const { currentUser, matchGroups, activities } = state;
  const navigate = useNavigate();

  const activity = activities.find((a) => a.slug === activitySlug);
  const golfProfile = useUserProfile(activitySlug);

  const myGroups = matchGroups.filter(
    (g) =>
      g.activityId === activitySlug &&
      g.memberIds.includes(currentUser.id),
  );

  const discoverGroups = matchGroups.filter(
    (g) =>
      g.activityId === activitySlug &&
      g.status === "forming" &&
      !g.memberIds.includes(currentUser.id),
  );

  // Count active groups per intensity level
  const groupCountsByLevel: Record<string, number> = {};
  if (activity) {
    for (const level of activity.intensityLevels) {
      groupCountsByLevel[level.id] = 0;
    }
    for (const group of matchGroups) {
      if (group.activityId !== activitySlug || group.status === "archived") continue;
      // Get first member's intensity as the group's intensity
      const firstMember = USERS.find((u) => u.id === group.memberIds[0]);
      const profile = firstMember?.activityProfiles.find(
        (p) => p.activityId === activitySlug,
      );
      if (profile?.intensityLevel) {
        groupCountsByLevel[profile.intensityLevel] =
          (groupCountsByLevel[profile.intensityLevel] ?? 0) + 1;
      }
    }
  }

  // Resolve display labels from profile fields
  const skillField = activity?.profileFields.find((f) => f.id === "skill-level");
  const walkField = activity?.profileFields.find((f) => f.id === "walking-preference");
  const intensityLabel = activity?.intensityLevels.find(
    (l) => l.id === golfProfile?.intensityLevel,
  )?.label;
  const walkLabel = walkField?.options?.find(
    (o) => o.value === golfProfile?.fieldValues?.["walking-preference"],
  )?.label;

  const pageTitle = activity?.name ?? activitySlug.charAt(0).toUpperCase() + activitySlug.slice(1);

  return (
    <div className="h-full overflow-y-auto bg-gathr-cream">
      <TopBar title={pageTitle} back="/home" />

      <div className="px-4 pb-20 sm:px-8 md:px-16 lg:max-w-2xl lg:mx-auto lg:px-8" style={{ paddingTop: 72 }}>

        {/* ── Profile Summary Card ── */}
        <div className="mb-8">
          {golfProfile ? (
            <div className="bg-white/80 rounded-2xl shadow-warm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display text-lg text-gathr-charcoal leading-tight">
                    Your {pageTitle} Profile
                  </p>
                  {intensityLabel && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-gathr-amber/15 text-gathr-amber font-body text-xs font-semibold">
                      {intensityLabel}
                    </span>
                  )}
                </div>
                <Link
                  to="/activity/$activitySlug/profile"
                  params={{ activitySlug }}
                  className="font-body text-sm text-gathr-forest hover:underline shrink-0 ml-3"
                >
                  Edit profile →
                </Link>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {typeof golfProfile.fieldValues["skill-level"] === "number" && (
                  <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 text-center">
                    <p className="font-display text-lg text-gathr-charcoal leading-none">
                      {golfProfile.fieldValues["skill-level"] as number}
                    </p>
                    <p className="font-body text-[10px] text-gathr-warm-gray mt-0.5 leading-tight">
                      {skillField?.label ?? "Score"}
                    </p>
                  </div>
                )}
                {golfProfile.frequencyGoal && (
                  <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 text-center">
                    <p className="font-display text-sm text-gathr-charcoal leading-none">
                      {golfProfile.frequencyGoal}
                    </p>
                    <p className="font-body text-[10px] text-gathr-warm-gray mt-0.5 leading-tight">
                      Frequency
                    </p>
                  </div>
                )}
                {walkLabel && (
                  <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 text-center">
                    <p className="font-display text-sm text-gathr-charcoal leading-none">
                      {walkLabel}
                    </p>
                    <p className="font-body text-[10px] text-gathr-warm-gray mt-0.5 leading-tight">
                      Preference
                    </p>
                  </div>
                )}
              </div>

              {golfProfile.thirdObject && (
                <p className="font-body text-sm text-gathr-warm-gray italic leading-snug border-t border-gathr-warm-gray/15 pt-3">
                  "{golfProfile.thirdObject}"
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white/80 rounded-2xl shadow-warm p-4 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gathr-amber/10 flex items-center justify-center">
                <span className="text-2xl" role="img" aria-label="golf flag">⛳</span>
              </div>
              <div>
                <p className="font-display text-lg text-gathr-charcoal">
                  Set up your {pageTitle.toLowerCase()} profile
                </p>
                <p className="font-body text-sm text-gathr-warm-gray mt-1 leading-relaxed">
                  Tell us about your game so we can find your people
                </p>
              </div>
              <GathrButton
                variant="primary"
                onClick={() =>
                  navigate({
                    to: "/activity/$activitySlug/profile",
                    params: { activitySlug },
                  })
                }
              >
                Get started
              </GathrButton>
            </div>
          )}
        </div>

        {/* ── Your Groups ── */}
        {myGroups.length > 0 && (
          <section className="mb-8">
            <SectionHeader title="Your Groups" className="px-0" />

            <div className="flex flex-col gap-2">
              {myGroups.map((group) => {
                const members = group.memberIds.map((uid) => {
                  const u = USERS.find((x) => x.id === uid);
                  return u
                    ? { initials: u.firstName.slice(0, 2).toUpperCase(), alt: u.firstName }
                    : { initials: "?", alt: "Unknown" };
                });
                return (
                  <Link
                    key={group.id}
                    to="/group/$groupId"
                    params={{ groupId: group.id }}
                    className="flex items-center gap-3 bg-gathr-cream-dark rounded-xl px-4 py-3 active:bg-black/[0.03] transition-colors"
                  >
                    <AvatarGroup avatars={members} max={3} size="xs" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-gathr-charcoal truncate">
                        {group.name}
                      </p>
                      <p className="font-body text-xs text-gathr-warm-gray mt-0.5">
                        {group.memberIds.length} member
                        {group.memberIds.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 px-2 py-0.5 rounded-full font-body text-[10px] font-semibold",
                        group.status === "active"
                          ? "bg-gathr-amber/15 text-gathr-amber"
                          : "bg-gathr-forest/15 text-gathr-forest",
                      )}
                    >
                      {group.status}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Find Your People ── */}
        <section className="mb-8">
          <SectionHeader title="Find Your People" className="px-0" />

          {discoverGroups.length === 0 ? (
            <p className="font-body text-sm text-gathr-warm-gray py-4">
              No groups forming right now. We'll notify you when we find a match.
            </p>
          ) : (
            discoverGroups.map((group) => (
              <DiscoverCard
                key={group.id}
                group={group}
                idealSize={activity?.coordinationSchema.idealGroupSize ?? 4}
                onJoin={() => joinGroup(group.id)}
              />
            ))
          )}
        </section>

        {/* ── Intensity Spectrum ── */}
        {activity && (
          <section className="mb-8">
            <SectionHeader title="Intensity Spectrum" className="px-0" />
            <IntensitySpectrum
              levels={activity.intensityLevels}
              userLevelId={golfProfile?.intensityLevel}
              groupCountsByLevel={groupCountsByLevel}
            />
          </section>
        )}

      </div>
    </div>
  );
}
