import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, MapPin, Users, Calendar, Flag } from "lucide-react";
import {
  TopBar,
  GathrAvatar,
  StatCounter,
  SectionHeader,
} from "@/components/ui";
import {
  ACCENT_COLOR_CLASS,
  COMMUNITIES,
  USERS,
  MATCH_GROUPS,
  SCHEDULED_SESSIONS,
  RECENT_SESSIONS,
} from "@/lib/mock-data";
import { useGathr } from "@/lib/GathrContext";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Gathr — Your profile" }] }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const { state } = useGathr();
  const { currentUser } = state;

  // Communities (legacy — TODO: Replace with activity-based discovery)
  const joinedCommunities = COMMUNITIES.filter((c) => c.isJoined);

  // Groups the current user belongs to
  const myGroups = state.matchGroups.filter((g) =>
    g.memberIds.includes(currentUser.id),
  );
  const myGroupIds = new Set(myGroups.map((g) => g.id));

  // "Up next" — upcoming tee times from the current user's groups
  const upcomingSessions = SCHEDULED_SESSIONS.filter(
    (s) => myGroupIds.has(s.matchGroupId) && s.status === "upcoming",
  ).slice(0, 2);

  // "Recent activity" — past sessions from the current user's groups
  const recentSessions = RECENT_SESSIONS.filter(
    (s) => myGroupIds.has(s.matchGroupId),
  ).slice(0, 5);

  // "People in your groups" — other members across all of the current user's groups
  const groupMemberIds = new Set(
    myGroups.flatMap((g) => g.memberIds).filter((id) => id !== currentUser.id),
  );
  const groupMembers = USERS.filter((u) => groupMemberIds.has(u.id)).slice(0, 8);
  const hasMoreMembers = groupMemberIds.size > 8;

  // Helper: get group name by ID
  const groupName = (groupId: string) =>
    MATCH_GROUPS.find((g) => g.id === groupId)?.name ?? groupId;

  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar
        title="Profile"
        back="/home"
        showBell={false}
        rightAction={
          <Link
            to="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gathr-charcoal hover:bg-gathr-cream-dark transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" strokeWidth={1.75} />
          </Link>
        }
      />

      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div className="w-full lg:max-w-2xl lg:mx-auto">
          <div>

            {/* ── Header ─────────────────────────────────────────── */}
            <section className="flex flex-col items-center px-5 pt-8 pb-4 text-center">
              <div
                style={{ boxShadow: "0 0 0 4px rgba(212,137,63,0.15)" }}
                className="rounded-full"
              >
                <GathrAvatar
                  size="lg"
                  initials={currentUser.firstName.slice(0, 2).toUpperCase()}
                  src={currentUser.avatarUrl}
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <h1 className="font-display text-2xl text-gathr-charcoal">
                  {currentUser.firstName}
                </h1>
                <button
                  onClick={() => alert("Edit profile coming soon!")}
                  className="text-sm font-medium text-gathr-forest hover:underline leading-none"
                >
                  Edit
                </button>
              </div>

              <p className="mt-0.5 text-sm text-gathr-warm-gray">
                {currentUser.neighborhood} · Member since {currentUser.memberSince}
              </p>
            </section>

            {/* ── Stats Row ──────────────────────────────────────── */}
            <section className="px-5 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 flex justify-center">
                  <StatCounter value={currentUser.eventsAttended} label="events" />
                </div>
                <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 flex justify-center">
                  <StatCounter value={currentUser.communitiesCount} label="communities" />
                </div>
                <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 flex justify-center">
                  <StatCounter value={currentUser.connectionsCount} label="connections" />
                </div>
              </div>

              {currentUser.streakWeeks > 0 && (
                <div className="mt-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gathr-forest/10 px-3 py-1 text-sm font-medium text-gathr-forest">
                    🔥 {currentUser.streakWeeks}-week streak
                  </span>
                </div>
              )}
            </section>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Up Next ────────────────────────────────────────── */}
            <section className="px-5 pt-5 pb-4">
              <SectionHeader title="Up next" />
              {upcomingSessions.length > 0 ? (
                <div className="space-y-2">
                  {upcomingSessions.map((s) => (
                    <Link
                      key={s.id}
                      to="/group/$groupId"
                      params={{ groupId: s.matchGroupId }}
                      className="block bg-white/80 rounded-2xl shadow-warm p-4 transition-colors"
                    >
                      <p className="font-display text-base text-gathr-charcoal leading-snug">
                        {s.courseName}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gathr-warm-gray">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {s.date} · {s.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {groupName(s.matchGroupId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {s.confirmedMemberIds.length} confirmed
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gathr-warm-gray">
                  Nothing planned yet.{" "}
                  <Link to="/home" className="text-gathr-warm-gray underline-offset-2 hover:underline">
                    See what's happening →
                  </Link>
                </p>
              )}
            </section>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Communities ────────────────────────────────────── */}
            {/* TODO: Replace with activity-based discovery */}
            {joinedCommunities.length > 0 && (
              <section className="pt-5 pb-4">
                <div className="px-5">
                  <SectionHeader title="Communities" />
                </div>
                <div className="relative">
                  <div className="-mx-0 flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-none">
                    {joinedCommunities.map((c) => (
                      <Link
                        key={c.id}
                        to="/activity/$activitySlug"
                        params={{ activitySlug: "golf" }}
                        className="shrink-0 flex items-center gap-2 rounded-full border border-gathr-warm-gray-light bg-gathr-cream-dark px-3 py-1.5 text-sm text-gathr-charcoal hover:border-gathr-warm-gray transition-colors"
                      >
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${ACCENT_COLOR_CLASS[c.accentColor]}`}
                        />
                        {c.name}
                      </Link>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
                </div>
              </section>
            )}

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── People in your groups ──────────────────────────── */}
            <section className="px-5 pt-5 pb-4">
              <SectionHeader
                title={`People in your groups · ${groupMemberIds.size} people`}
                linkLabel={hasMoreMembers ? "See all →" : undefined}
              />
              {groupMembers.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {groupMembers.map((u, i) => (
                    <Link
                      key={u.id}
                      to="/profile/$userId"
                      params={{ userId: u.id }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <GathrAvatar
                        size="sm"
                        initials={u.firstName.slice(0, 2).toUpperCase()}
                        src={u.avatarUrl}
                        className={
                          i % 5 === 1
                            ? "bg-gathr-sage"
                            : i % 5 === 2
                              ? "bg-gathr-coral"
                              : i % 5 === 3
                                ? "bg-gathr-amber"
                                : undefined
                        }
                      />
                      <span className="text-xs text-gathr-charcoal text-center leading-tight">
                        {u.firstName}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gathr-warm-gray">
                  Join a group to meet other players.
                </p>
              )}
            </section>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Recent Activity ────────────────────────────────── */}
            <section className="px-5 pt-5 pb-6">
              <SectionHeader title="Recent activity" />
              <div className="relative pl-4">
                <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-gathr-warm-gray-light/60" />
                <div className="space-y-4">
                  {recentSessions.length > 0 ? recentSessions.map((s) => (
                    <Link
                      key={s.id}
                      to="/group/$groupId"
                      params={{ groupId: s.matchGroupId }}
                      className="relative flex items-start gap-3 group"
                    >
                      <span className="absolute -left-4 top-[5px] h-2 w-2 rounded-full bg-gathr-forest ring-2 ring-background shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gathr-charcoal group-hover:text-gathr-forest transition-colors">
                          {s.courseName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gathr-warm-gray">
                            {s.date}
                          </span>
                          <span className="text-xs text-gathr-warm-gray-light">·</span>
                          <span className="flex items-center gap-1 text-xs text-gathr-warm-gray">
                            <Flag className="h-3 w-3" />
                            {s.score}
                          </span>
                          <span className="text-xs text-gathr-warm-gray-light">·</span>
                          <span className="text-xs text-gathr-warm-gray">
                            {groupName(s.matchGroupId)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-sm text-gathr-warm-gray">No recent rounds yet.</p>
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
