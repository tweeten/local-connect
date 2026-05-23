import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Flame, MapPin, Users, Calendar } from "lucide-react";
import {
  TopBar,
  GathrAvatar,
  StatCounter,
  SectionHeader,
} from "@/components/ui";
import {
  ACCENT_COLOR_CLASS,
  CONNECTIONS,
  USER_BY_ID,
  formatEventDate,
} from "@/lib/gather-data";
import { useGathr } from "@/lib/GathrContext";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Gathr — Your profile" }] }),
  component: ProfileScreen,
});

function ProfileScreen() {
  const { state } = useGathr();
  const { currentUser, communities, events } = state;

  const joinedCommunities = communities.filter((c) => c.isJoined);
  const attendingEvents = events.filter((e) => e.isAttending).slice(0, 2);
  const recentActivity = events.slice(0, 5);

  const connectionIds = CONNECTIONS[currentUser.id] ?? [];
  const connections = connectionIds
    .map((id) => USER_BY_ID[id])
    .filter(Boolean)
    .slice(0, 8);
  const hasMoreConnections = connectionIds.length > 8;

  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar
        title="Profile"
        back="/app"
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
        <div className="w-full">
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
                  className="text-sm font-medium text-gathr-amber hover:underline leading-none"
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
              <div className="flex items-center justify-around">
                <StatCounter value={currentUser.eventsAttended} label="events" />
                <div className="h-8 w-px bg-gathr-warm-gray-light/60" />
                <StatCounter value={currentUser.communitiesCount} label="communities" />
                <div className="h-8 w-px bg-gathr-warm-gray-light/60" />
                <StatCounter value={currentUser.connectionsCount} label="connections" />
              </div>

              {currentUser.streakWeeks > 0 && (
                <div className="mt-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gathr-amber/10 px-3 py-1 text-sm font-medium text-gathr-amber">
                    🔥 {currentUser.streakWeeks}-week streak
                  </span>
                </div>
              )}
            </section>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Up Next ────────────────────────────────────────── */}
            <section className="px-5 pt-5 pb-4">
              <SectionHeader title="Up next" />
              {attendingEvents.length > 0 ? (
                <div className="space-y-2">
                  {attendingEvents.map((e) => (
                    <Link
                      key={e.id}
                      to="/event/$eventId"
                      params={{ eventId: e.id }}
                      className="block rounded-2xl bg-background px-4 py-3 ring-1 ring-border/60 hover:ring-primary/40 transition-colors"
                    >
                      <p className="font-display text-base text-gathr-charcoal leading-snug">
                        {e.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gathr-warm-gray">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatEventDate(e.dateTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {e.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {e.totalAttendees}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gathr-warm-gray">
                  Nothing planned yet.{" "}
                  <Link to="/app" className="text-gathr-warm-gray underline-offset-2 hover:underline">
                    See what's happening →
                  </Link>
                </p>
              )}
            </section>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Communities ────────────────────────────────────── */}
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
                        to="/community/$communityId"
                        params={{ communityId: c.id }}
                        className="shrink-0 flex items-center gap-2 rounded-full border border-gathr-warm-gray-light bg-gathr-cream-dark px-3 py-1.5 text-sm text-gathr-charcoal hover:border-gathr-warm-gray transition-colors"
                      >
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${ACCENT_COLOR_CLASS[c.accentColor]}`}
                        />
                        {c.name}
                      </Link>
                    ))}
                  </div>
                  {/* Right fade edge */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
                </div>
              </section>
            )}

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Connections ────────────────────────────────────── */}
            <section className="px-5 pt-5 pb-4">
              <SectionHeader
                title={`Connections · ${connectionIds.length} people`}
                linkLabel={hasMoreConnections ? "See all →" : undefined}
              />
              {connections.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {connections.map((u, i) => (
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
                                ? "bg-gathr-forest"
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
                  Going to events is the best way to meet people.
                </p>
              )}
            </section>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Recent Activity ────────────────────────────────── */}
            <section className="px-5 pt-5 pb-6">
              <SectionHeader title="Recent activity" />
              <div className="relative pl-4">
                {/* Vertical timeline line */}
                <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-gathr-warm-gray-light/60" />
                <div className="space-y-4">
                  {recentActivity.map((e) => (
                    <Link
                      key={e.id}
                      to="/event/$eventId"
                      params={{ eventId: e.id }}
                      className="relative flex items-start gap-3 group"
                    >
                      {/* Amber dot */}
                      <span className="absolute -left-4 top-[5px] h-2 w-2 rounded-full bg-gathr-amber ring-2 ring-background shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gathr-charcoal group-hover:text-gathr-amber transition-colors">
                          {e.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gathr-warm-gray">
                            {formatEventDate(e.dateTime)}
                          </span>
                          <span className="text-xs text-gathr-warm-gray-light">·</span>
                          <span className="text-xs text-gathr-warm-gray">
                            {e.totalAttendees} people
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
