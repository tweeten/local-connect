import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Users } from "lucide-react";
import {
  TopBar,
  GathrAvatar,
  StatCounter,
  SectionHeader,
  GathrButton,
  EmptyState,
} from "@/components/ui";
import { USERS, MATCH_GROUPS } from "@/lib/mock-data";
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

  const user = USERS.find((u) => u.id === userId);

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

  // Groups shared between the current user and the viewed user
  const sharedGroups = MATCH_GROUPS.filter(
    (g) => g.memberIds.includes(currentUser.id) && g.memberIds.includes(userId),
  );
  const isInSharedGroup = sharedGroups.length > 0;

  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar back="/profile" title={user.firstName} showBell={false} />

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

              {isInSharedGroup && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gathr-forest/10 px-3 py-1 text-xs font-medium text-gathr-forest">
                  <Users className="h-3 w-3" />
                  In a group with you
                </span>
              )}
            </section>

            {/* ── Stats Row ──────────────────────────────────────── */}
            <section className="px-5 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 flex justify-center">
                  <StatCounter value={user.eventsAttended} label="events" />
                </div>
                <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 flex justify-center">
                  <StatCounter value={user.communitiesCount} label="communities" />
                </div>
                <div className="bg-white/60 rounded-xl shadow-warm-sm p-3 flex justify-center">
                  <StatCounter value={user.connectionsCount} label="connections" />
                </div>
              </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <div className="px-5 pb-4">
              {isInSharedGroup ? (
                <Link to="/group/$groupId" params={{ groupId: sharedGroups[0].id }}>
                  <GathrButton variant="primary" className="w-full">
                    Say hi
                  </GathrButton>
                </Link>
              ) : (
                <p className="flex items-center justify-center gap-1.5 text-sm text-gathr-warm-gray text-center">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  Join a group with {user.firstName} to message them
                </p>
              )}
            </div>

            <div className="mx-5 h-px bg-gathr-warm-gray-light/40" />

            {/* ── Also in your groups ────────────────────────────── */}
            <section className="px-5 pt-5 pb-6">
              <SectionHeader
                title={`Also in your groups · ${sharedGroups.length}`}
              />
              {sharedGroups.length > 0 ? (
                <div className="space-y-2">
                  {sharedGroups.map((g) => (
                    <Link
                      key={g.id}
                      to="/group/$groupId"
                      params={{ groupId: g.id }}
                      className="block bg-white/80 rounded-2xl shadow-warm p-4 transition-colors"
                    >
                      <p className="font-display text-base text-gathr-charcoal leading-snug">
                        {g.name}
                      </p>
                      <p className="mt-1 text-xs text-gathr-warm-gray">
                        {g.memberIds.length} members · {g.matchScore}% match
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gathr-warm-gray">
                  You and {user.firstName} aren't in any groups together yet.
                </p>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
