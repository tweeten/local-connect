import { useState, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Settings, CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  TopBar,
  GathrAvatar,
  ThreadCard,
  GathrButton,
  SectionHeader,
  EmptyState,
} from "@/components/ui";
import {
  GOLF_ACTIVITY,
  MATCH_GROUPS,
  USERS,
  THREADS,
  RECENT_SESSIONS,
  SCHEDULED_SESSIONS,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/group/$groupId")({
  component: GroupComponent,
  head: () => ({ meta: [{ title: "Gathr — Group" }] }),
});

function GroupComponent() {
  const { groupId } = Route.useParams();
  const navigate = useNavigate();

  const group = MATCH_GROUPS.find((g) => g.id === groupId);

  const [scrolled, setScrolled] = useState(false);
  const [rsvp, setRsvp] = useState<"in" | "out" | null>(null);
  const [pastExpanded, setPastExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!group) {
    return (
      <div className="min-h-screen bg-gathr-cream flex flex-col items-center justify-center">
        <TopBar back="/home" showBell={false} />
        <EmptyState
          headline="Group not found"
          body="This group doesn't exist or you may not have access to it."
          ctaLabel="Back to home"
          onCta={() => navigate({ to: "/home" })}
          className="mt-14"
        />
      </div>
    );
  }

  const members = group.memberIds
    .map((id) => USERS.find((u) => u.id === id))
    .filter(Boolean) as (typeof USERS)[number][];

  const groupThreads = THREADS.filter((t) => t.matchGroupId === groupId);
  const groupRecentSessions = RECENT_SESSIONS.filter(
    (s) => s.matchGroupId === groupId,
  );
  const groupSessions = SCHEDULED_SESSIONS.filter(
    (s) => s.matchGroupId === groupId,
  );
  const upcomingSessions = groupSessions.filter((s) => s.status === "upcoming");
  const pastSessions = groupSessions.filter((s) => s.status === "past");
  const nextSession = upcomingSessions[0] ?? null;
  const additionalSessions = upcomingSessions.slice(1);

  const sharedGoals = group.coordinationSpace.sharedGoals;

  const avgScore = Math.round(
    members.reduce((sum, m) => {
      const profile = m.activityProfiles.find((p) => p.activityId === "golf");
      const score = profile ? (profile.fieldValues["skill-level"] as number) : 90;
      return sum + score;
    }, 0) / members.length,
  );

  const firstProfile = members[0]?.activityProfiles.find(
    (p) => p.activityId === "golf",
  );
  const walkPref = firstProfile?.fieldValues["walking-preference"] as
    | string
    | undefined;
  const walkLabel =
    GOLF_ACTIVITY.profileFields
      .find((f) => f.id === "walking-preference")
      ?.options?.find((o) => o.value === walkPref)?.label ?? "Cart";
  const frequencyLabel = firstProfile?.frequencyGoal ?? "Weekly";

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrolled(scrollRef.current.scrollTop > 8);
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full bg-gathr-cream overflow-y-auto"
    >
      <TopBar
        back="/home"
        title={group.name}
        showBell={false}
        scrolled={scrolled}
        rightAction={
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-gathr-charcoal hover:bg-gathr-cream-dark transition-colors"
            aria-label="Group settings"
          >
            <Settings className="h-5 w-5" strokeWidth={1.75} />
          </button>
        }
      />

      <div className="pt-[56px] pb-28 lg:max-w-2xl lg:mx-auto">
        {/* ── Group Header ─────────────────────────────────────── */}
        <div className="px-5 pt-5 pb-4 sm:px-8 md:px-12">
          <div className="flex gap-4 justify-center mb-4">
            {members.map((member) => (
              <Link
                key={member.id}
                to="/profile/$userId"
                params={{ userId: member.id }}
                className="flex flex-col items-center gap-1.5"
              >
                <GathrAvatar
                  initials={member.firstName.charAt(0)}
                  size="sm"
                  alt={member.firstName}
                />
                <span className="text-xs font-body text-gathr-charcoal font-medium">
                  {member.firstName}
                </span>
              </Link>
            ))}
          </div>

          <p className="text-sm text-gathr-warm-gray text-center font-body">
            Avg score: {avgScore} · Plays {frequencyLabel.toLowerCase()} · {walkLabel}
          </p>
        </div>

        {/* ── Next Session Hero ─────────────────────────────────── */}
        <div className="px-5 sm:px-8 md:px-12">
          <SectionHeader title="Next up" />

          {nextSession ? (
            <div className="bg-white/80 rounded-2xl shadow-warm p-4">
              <div className="mb-3">
                <p className="font-display text-lg text-gathr-charcoal">
                  {nextSession.courseName}
                </p>
                <p className="text-sm text-gathr-warm-gray font-body mt-0.5">
                  {nextSession.date} · {nextSession.time}
                </p>
              </div>

              <div className="flex gap-2 items-center mb-4">
                {members.map((m) => {
                  const confirmed = nextSession.confirmedMemberIds.includes(m.id);
                  return (
                    <div key={m.id} className="relative">
                      <GathrAvatar
                        initials={m.firstName.charAt(0)}
                        size="xs"
                        alt={m.firstName}
                        className={confirmed ? "" : "opacity-40"}
                      />
                      {confirmed && (
                        <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-gathr-forest bg-gathr-cream rounded-full" />
                      )}
                    </div>
                  );
                })}
                <span className="text-xs text-gathr-warm-gray font-body ml-1">
                  {nextSession.confirmedMemberIds.length} confirmed
                </span>
              </div>

              <div className="flex gap-2">
                <GathrButton
                  variant={rsvp === "in" ? "primary" : "secondary"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setRsvp("in")}
                >
                  I'm in
                </GathrButton>
                <GathrButton
                  variant={rsvp === "out" ? "primary" : "secondary"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setRsvp("out")}
                >
                  Can't make it
                </GathrButton>
              </div>
            </div>
          ) : (
            <EmptyState
              headline="Nothing scheduled yet"
              body="Suggest a tee time to get the ball rolling with your group."
              ctaLabel="Suggest a time"
              onCta={() => toast.info("Coming soon")}
              className="py-6"
            />
          )}

          <button
            className="mt-3 text-sm font-body text-gathr-warm-gray hover:text-gathr-charcoal transition-colors"
            onClick={() => toast.info("Coming soon")}
          >
            Suggest a time
          </button>

          {additionalSessions.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {additionalSessions.map((s) => (
                <CompactSessionCard key={s.id} session={s} />
              ))}
            </div>
          )}
        </div>

        {/* ── Conversations ─────────────────────────────────────── */}
        <div className="mt-8 px-5 sm:px-8 md:px-12">
          <SectionHeader title="Conversations" />

          <div className="flex items-center gap-3 bg-gathr-cream-dark rounded-xl px-4 py-3 mb-3">
            <GathrAvatar initials="T" size="sm" />
            <span className="text-sm text-gathr-warm-gray font-body">
              Share something with the group…
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {groupThreads.map((thread) => (
              <div key={thread.id}>
                <ThreadCard
                  id={thread.id}
                  poster={{ initials: getInitials(thread.authorId) }}
                  posterName={getFirstName(thread.authorId)}
                  title={thread.title}
                  preview={thread.preview}
                  replyCount={thread.replyCount}
                  timestamp={thread.timestamp}
                  onPress={(id) =>
                    navigate({
                      to: "/group/$groupId/thread/$threadId",
                      params: { groupId, threadId: id },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Rounds ─────────────────────────────────────── */}
        {groupRecentSessions.length > 0 && (
          <div className="mt-8 px-5 sm:px-8 md:px-12">
            <SectionHeader title="Recent rounds" />
            <div className="flex flex-col gap-2">
              {groupRecentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between bg-gathr-cream-dark rounded-xl px-4 py-3"
                >
                  <p className="text-sm font-body text-gathr-warm-gray">
                    <span className="font-medium text-gathr-charcoal">
                      {getFirstName(session.userId)}
                    </span>
                    {" shot "}
                    <span className="font-semibold text-gathr-charcoal">
                      {session.score}
                    </span>
                    {" at "}
                    <span className="text-gathr-charcoal">{session.courseName}</span>
                  </p>
                  <span className="text-xs text-gathr-warm-gray font-body ml-3 shrink-0">
                    {session.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Group Goal ────────────────────────────────────────── */}
        {sharedGoals.length > 0 && (
          <div className="mt-8 px-5 sm:px-8 md:px-12">
            <SectionHeader title="Group goal" />
            {sharedGoals.map((goal) => {
              const allProgress = goal.memberProgress;
              const avgCurrent =
                allProgress.reduce((s, p) => s + p.current, 0) / allProgress.length;
              const avgTarget =
                allProgress.reduce((s, p) => s + p.target, 0) / allProgress.length;
              const overallPct = Math.min(
                100,
                Math.round((avgTarget / avgCurrent) * 100),
              );

              return (
                <div
                  key={goal.id}
                  className="bg-white/80 rounded-2xl shadow-warm p-4 mb-3"
                >
                  <p className="font-display text-base text-gathr-charcoal">
                    {goal.title}
                  </p>
                  {goal.targetDate && (
                    <p className="text-xs text-gathr-warm-gray font-body mt-0.5 mb-3">
                      Target: {formatDate(goal.targetDate)}
                    </p>
                  )}
                  <ProgressBar value={overallPct} />

                  <div className="mt-4 flex flex-col gap-3">
                    {allProgress.map((mp) => {
                      const member = members.find((m) => m.id === mp.userId);
                      if (!member) return null;
                      const pct = Math.min(
                        100,
                        Math.round((mp.target / mp.current) * 100),
                      );
                      return (
                        <div key={mp.userId} className="flex items-center gap-3">
                          <GathrAvatar
                            initials={member.firstName.charAt(0)}
                            size="xs"
                            alt={member.firstName}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="text-xs font-body font-medium text-gathr-charcoal">
                                {member.firstName}
                              </span>
                              <span className="text-xs text-gathr-warm-gray font-body">
                                {mp.current} → {mp.target}
                              </span>
                            </div>
                            <ProgressBar value={pct} size="sm" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Past Sessions (collapsible) ───────────────────────── */}
        {pastSessions.length > 0 && (
          <div className="mt-8 px-5 sm:px-8 md:px-12">
            <button
              onClick={() => setPastExpanded((v) => !v)}
              className="flex w-full items-center justify-between mb-3 group"
            >
              <span className="text-sm font-body font-semibold text-gathr-charcoal uppercase tracking-wide">
                Past sessions
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gathr-warm-gray transition-transform duration-200",
                  pastExpanded && "rotate-180",
                )}
              />
            </button>

            {pastExpanded && (
              <div className="flex flex-col gap-2">
                {pastSessions.map((s) => (
                  <PastSessionCard key={s.id} session={s} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Session cards ────────────────────────────────────────────────────────────

function CompactSessionCard({ session }: { session: (typeof SCHEDULED_SESSIONS)[number] }) {
  return (
    <div className="flex items-center justify-between bg-gathr-cream-dark rounded-xl px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gathr-charcoal font-body">
          {session.courseName}
        </p>
        <p className="text-xs text-gathr-warm-gray font-body mt-0.5">
          {session.date} · {session.time}
        </p>
      </div>
      <span className="text-xs text-gathr-warm-gray font-body">
        {session.confirmedMemberIds.length} in
      </span>
    </div>
  );
}

function PastSessionCard({ session }: { session: (typeof SCHEDULED_SESSIONS)[number] }) {
  const scoreEntries = session.scores ? Object.entries(session.scores) : [];
  return (
    <div className="bg-gathr-cream-dark rounded-xl px-4 py-3 opacity-70">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gathr-charcoal font-body">
          {session.courseName}
        </p>
        <p className="text-xs text-gathr-warm-gray font-body">{session.date}</p>
      </div>
      {scoreEntries.length > 0 && (
        <p className="text-xs text-gathr-warm-gray font-body mt-1">
          {scoreEntries
            .map(([uid, score]) => `${getFirstName(uid)} ${score}`)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function ProgressBar({
  value,
  size = "default",
}: {
  value: number;
  size?: "default" | "sm";
}) {
  return (
    <div
      className={cn(
        "w-full bg-gathr-cream rounded-full overflow-hidden",
        size === "sm" ? "h-1" : "h-1.5",
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(2, value)}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="h-full bg-gathr-forest rounded-full"
      />
    </div>
  );
}

// ─── Tiny utilities ───────────────────────────────────────────────────────────

function getFirstName(userId: string): string {
  return USERS.find((u) => u.id === userId)?.firstName ?? "Member";
}

function getInitials(userId: string): string {
  return getFirstName(userId).charAt(0).toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
