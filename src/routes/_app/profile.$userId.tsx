import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, MapPin, Users, Calendar } from "lucide-react";
import {
  TopBar,
  GathrAvatar,
  StatCounter,
  SectionHeader,
  GathrButton,
  EmptyState,
} from "@/components/ui";
import {
  USER_BY_ID,
  CONNECTIONS,
  COMMUNITIES,
  EVENTS,
  ACCENT_COLOR_CLASS,
  getMutualConnections,
  getSharedCommunities,
  formatEventDate,
} from "@/lib/mock-data";
import { useGathr } from "@/lib/GathrContext";

export const Route = createFileRoute("/_app/profile/$userId")({
  head: () => ({ meta: [{ title: "Gathr — Profile" }] }),
  component: UserProfile,
});

function UserProfile() {
  const { userId } = Route.useParams();
  const { state } = useGathr();
  const { currentUser } = state;
  const navigate = useNavigate();

  const user = USER_BY_ID[userId];

  if (!user) {
    return (
      <div className="h-full flex flex-col bg-background">
        <TopBar back="/profile" title="Profile" showBell={false} />
        <main className="flex-1 overflow-y-auto pt-16 pb-20 px-5 flex items-center justify-center">
          <EmptyState
            headline="Person not found"
            body="This profile doesn't exist or may have been removed."
            ctaLabel="Back to your profile"
            onCta={() => navigate({ to: "/profile" })}
          />
        </main>
      </div>
    );
  }

  const isMutual = (CONNECTIONS[currentUser.id] ?? []).includes(userId);

  const mutualConnections = getMutualConnections(currentUser.id, userId);
  const sharedCommunityIds = new Set(getSharedCommunities(currentUser.id, userId));

  // Upcoming events filtered to shared communities
  const upcomingEvents = EVENTS.filter(
    (e) =>
      sharedCommunityIds.has(e.communityId) &&
      (e.attendees.some((a) => a.id === userId) || e.host.id === userId),
  ).slice(0, 2);

  // Communities this user is in that we share
  const sharedCommunities = COMMUNITIES.filter((c) =>
    sharedCommunityIds.has(c.id),
  );

  const connectionIds = CONNECTIONS[userId] ?? [];

  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar back="/profile" title={user.firstName} showBell={false} />

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
                  initials={user.firstName.slice(0, 2).toUpperCase()}
                  src={user.avatarUrl}
                />
              </div>

              <h1 className="mt-3 font-display text-2xl text-gathr-charcoal">
                {user.firstName}
              </h1>
              <p className="mt-0.5 text-sm text-gathr-warm-gray">
                {user.neighborhood} · Member since {user.memberSince}
              </p>
            </section>

            {/* ── Stats Row ──────────────────────────────────────── */}
            <section className="px-5 py-4">
              <div className="flex items-center justify-around">
                <StatCounter value={user.eventsAttended} label="events" />
                <div className="h-8 w-px bg-gathr-warm-gray-light/60" />
                <StatCounter value={user.communitiesCount} label="communities" />
                <div className="h-8 w-px bg-gathr-warm-gray-light/60" />
                <StatCounter value={user.connectionsCount} label="connections" />
              </div>
            </section>

            {/* ── Mutual connection CTA ──────────────────────────── */}
            <div className="px-5 pb-4">
              {isMutual ? (
                <Link to="/home">
                  <GathrButton variant="primary" className="w-full">
                    Say hi
                  </GathrButton>
                </Link>
              ) : (
                <p className="flex items-center justify-center gap-1.5 text-sm text-gathr-warm-gray text-center">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  Connect with {user.firstName} at an event to message them
                </p>
              )}
            </div>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Up Next (shared communities only) ─────────────── */}
            <section className="px-5 pt-5 pb-4">
              <SectionHeader title="Up next" />
              {upcomingEvents.length > 0 ? (
                <div className="space-y-2">
                  {upcomingEvents.map((e) => (
                    <Link
                      key={e.id}
                      to="/home"
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
                <EmptyState
                  headline="No shared events yet"
                  body={`Attend the same events as ${user.firstName} to see what you have in common.`}
                  ctaLabel="See what's happening"
                  onCta={() => navigate({ to: "/home" })}
                  className="py-4"
                />
              )}
            </section>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Shared Communities ─────────────────────────────── */}
            {sharedCommunities.length > 0 && (
              <>
                <section className="pt-5 pb-4">
                  <div className="px-5">
                    <SectionHeader title="Communities" />
                  </div>
                  <div className="relative">
                    <div className="flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-none">
                      {sharedCommunities.map((c) => (
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
                <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />
              </>
            )}

            {/* ── Mutual Connections ─────────────────────────────── */}
            <section className="px-5 pt-5 pb-6">
              <SectionHeader
                title={`${mutualConnections.length > 0 ? mutualConnections.length + " mutual" : "Mutual"} connections`}
              />
              {mutualConnections.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {mutualConnections.slice(0, 8).map((u, i) => (
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
                  {isMutual
                    ? "No other mutual connections yet."
                    : `Attend events with ${user.firstName} to build connections.`}
                </p>
              )}

              {/* Show all {connectionIds.length} connections count */}
              <p className="mt-4 text-xs text-gathr-warm-gray-light">
                {user.firstName} has {connectionIds.length} connection{connectionIds.length !== 1 ? "s" : ""}
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
