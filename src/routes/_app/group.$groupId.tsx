import { useState, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Settings, CheckCircle2, Calendar, Plus, X } from "lucide-react";
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
import {
  TRANSITION_SPRING,
  TRANSITION_GENTLE,
  PAGE_VARIANTS,
  STAGGER_CONTAINER,
  STAGGER_CHILDREN,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/group/$groupId")({
  component: GroupComponent,
  head: () => ({ meta: [{ title: "Gathr — Group" }] }),
});

type Tab = "feed" | "schedule" | "goals";

function GroupComponent() {
  const { groupId } = Route.useParams();
  const navigate = useNavigate();

  const group = MATCH_GROUPS.find((g) => g.id === groupId);

  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [scrolled, setScrolled] = useState(false);
  const [rsvp, setRsvp] = useState<"in" | "out" | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
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

  const groupThreads = THREADS.filter(
    (t) => t.matchGroupId === groupId,
  );
  const groupRecentSessions = RECENT_SESSIONS.filter(
    (s) => s.matchGroupId === groupId,
  );
  const groupSessions = SCHEDULED_SESSIONS.filter(
    (s) => s.matchGroupId === groupId,
  );
  const upcomingSessions = groupSessions.filter((s) => s.status === "upcoming");
  const pastSessions = groupSessions.filter((s) => s.status === "past");
  const nextSession = upcomingSessions[0] ?? null;

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
  const intensityLabel =
    GOLF_ACTIVITY.intensityLevels.find(
      (l) => l.id === firstProfile?.intensityLevel,
    )?.label ?? "Building a Game";
  const socialPref = firstProfile?.fieldValues["social-preference"] as
    | string
    | undefined;
  const socialLabel =
    GOLF_ACTIVITY.profileFields
      .find((f) => f.id === "social-preference")
      ?.options?.find((o) => o.value === socialPref)?.label ?? "Social rounds";
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
      className="min-h-screen bg-gathr-cream overflow-y-auto"
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

      <motion.div
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        className="pt-[56px]"
      >
        {/* ── Group Header ─────────────────────────────────────── */}
        <div className="px-5 pt-5 pb-4">
          {/* Member avatars */}
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

          {/* Stats line */}
          <p className="text-sm text-gathr-warm-gray text-center font-body">
            Avg score: {avgScore} · Plays {frequencyLabel.toLowerCase()} · {walkLabel}
          </p>

          {/* Vibe pill */}
          <div className="flex justify-center mt-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gathr-cream-dark border border-gathr-warm-gray-light text-xs font-body text-gathr-warm-gray">
              {intensityLabel} · {socialLabel}
            </span>
          </div>
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────── */}
        <div className="sticky top-[56px] z-40 bg-gathr-cream border-b border-gathr-warm-gray-light/60">
          <div className="flex">
            {(["feed", "schedule", "goals"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-sm font-body font-medium capitalize transition-colors",
                  activeTab === tab
                    ? "text-gathr-amber border-b-2 border-gathr-amber"
                    : "text-gathr-warm-gray hover:text-gathr-charcoal",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === "feed" && (
            <FeedTab
              key="feed"
              groupId={groupId}
              threads={groupThreads}
              recentSessions={groupRecentSessions}
            />
          )}
          {activeTab === "schedule" && (
            <ScheduleTab
              key="schedule"
              nextSession={nextSession}
              upcomingSessions={upcomingSessions.slice(1)}
              pastSessions={pastSessions}
              members={members}
              rsvp={rsvp}
              onRsvp={setRsvp}
              showSuggestModal={showSuggestModal}
              onOpenSuggest={() => setShowSuggestModal(true)}
              onCloseSuggest={() => setShowSuggestModal(false)}
            />
          )}
          {activeTab === "goals" && (
            <GoalsTab
              key="goals"
              group={group}
              members={members}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Feed Tab ────────────────────────────────────────────────────────────────

interface FeedTabProps {
  groupId: string;
  threads: (typeof THREADS)[number][];
  recentSessions: (typeof RECENT_SESSIONS)[number][];
}

function FeedTab({ groupId, threads, recentSessions }: FeedTabProps) {
  const navigate = useNavigate();

  const feedItems = buildFeedItems(threads, recentSessions);

  return (
    <motion.div
      key="feed"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={TRANSITION_GENTLE}
      className="px-4 pb-28"
    >
      {/* Compose bar */}
      <div className="mt-4 flex items-center gap-3 bg-gathr-cream-dark rounded-card-sm px-4 py-3 shadow-warm-sm">
        <GathrAvatar initials="T" size="sm" />
        <span className="text-sm text-gathr-warm-gray font-body">
          Share something with the group…
        </span>
      </div>

      {/* Feed list */}
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="initial"
        animate="animate"
        className="mt-3 flex flex-col gap-3"
      >
        {feedItems.map((item, i) =>
          item.type === "thread" ? (
            <motion.div
              key={item.thread.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_SPRING, delay: i * STAGGER_CHILDREN }}
            >
              <ThreadCard
                id={item.thread.id}
                poster={{ initials: getInitials(item.thread.authorId) }}
                posterName={getFirstName(item.thread.authorId)}
                title={item.thread.title}
                preview={item.thread.preview}
                replyCount={item.thread.replyCount}
                timestamp={item.thread.timestamp}
                onPress={(id) =>
                  navigate({
                    to: "/group/$groupId/thread/$threadId",
                    params: { groupId, threadId: id },
                  })
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key={item.session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...TRANSITION_SPRING, delay: i * STAGGER_CHILDREN }}
            >
              <ActivityCard session={item.session} />
            </motion.div>
          ),
        )}
      </motion.div>
    </motion.div>
  );
}

function ActivityCard({ session }: { session: (typeof RECENT_SESSIONS)[number] }) {
  const firstName = getFirstName(session.userId);
  return (
    <div className="flex items-center gap-3 bg-gathr-cream-dark/60 rounded-card-sm px-4 py-3 border border-gathr-warm-gray-light/50">
      <span className="text-base" aria-hidden="true">⛳</span>
      <p className="text-sm font-body text-gathr-warm-gray">
        <span className="font-medium text-gathr-charcoal">{firstName}</span>
        {" played "}
        <span className="text-gathr-charcoal">{session.courseName}</span>
        {" — shot "}
        <span className="font-semibold text-gathr-charcoal">{session.score}</span>
      </p>
    </div>
  );
}

type FeedItem =
  | { type: "thread"; thread: (typeof THREADS)[number] }
  | { type: "session"; session: (typeof RECENT_SESSIONS)[number] };

function buildFeedItems(
  threads: (typeof THREADS)[number][],
  sessions: (typeof RECENT_SESSIONS)[number][],
): FeedItem[] {
  const items: FeedItem[] = [];
  let sessionIdx = 0;
  threads.forEach((thread, i) => {
    items.push({ type: "thread", thread });
    if ((i + 1) % 2 === 0 && sessionIdx < sessions.length) {
      items.push({ type: "session", session: sessions[sessionIdx++] });
    }
  });
  return items;
}

// ─── Schedule Tab ────────────────────────────────────────────────────────────

interface ScheduleTabProps {
  nextSession: (typeof SCHEDULED_SESSIONS)[number] | null;
  upcomingSessions: (typeof SCHEDULED_SESSIONS)[number][];
  pastSessions: (typeof SCHEDULED_SESSIONS)[number][];
  members: (typeof USERS)[number][];
  rsvp: "in" | "out" | null;
  onRsvp: (v: "in" | "out") => void;
  showSuggestModal: boolean;
  onOpenSuggest: () => void;
  onCloseSuggest: () => void;
}

function ScheduleTab({
  nextSession,
  upcomingSessions,
  pastSessions,
  members,
  rsvp,
  onRsvp,
  showSuggestModal,
  onOpenSuggest,
  onCloseSuggest,
}: ScheduleTabProps) {
  return (
    <motion.div
      key="schedule"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={TRANSITION_GENTLE}
      className="px-4 pb-28"
    >
      {/* Next up */}
      <div className="mt-4">
        <SectionHeader title="Next up" />
        {nextSession ? (
          <div className="bg-gathr-cream-dark rounded-card-lg shadow-warm p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-display text-base text-gathr-charcoal">
                  {nextSession.courseName}
                </p>
                <p className="text-sm text-gathr-warm-gray font-body mt-0.5">
                  {nextSession.date} · {nextSession.time}
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-body text-gathr-amber bg-gathr-amber/10 px-2 py-1 rounded-full">
                <Calendar className="h-3 w-3" />
                Upcoming
              </span>
            </div>

            {/* Confirmed avatars */}
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
                      <CheckCircle2 className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-gathr-amber bg-gathr-cream rounded-full" />
                    )}
                  </div>
                );
              })}
              <span className="text-xs text-gathr-warm-gray font-body ml-1">
                {nextSession.confirmedMemberIds.length} confirmed
              </span>
            </div>

            {/* RSVP buttons */}
            <div className="flex gap-2">
              <GathrButton
                variant={rsvp === "in" ? "primary" : "secondary"}
                size="sm"
                className="flex-1"
                onClick={() => onRsvp("in")}
              >
                I'm in
              </GathrButton>
              <GathrButton
                variant={rsvp === "out" ? "primary" : "secondary"}
                size="sm"
                className="flex-1"
                onClick={() => onRsvp("out")}
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
            onCta={onOpenSuggest}
            className="py-6"
          />
        )}
      </div>

      {/* Other upcoming sessions */}
      {upcomingSessions.length > 0 && (
        <div className="mt-5">
          <SectionHeader title="Also coming up" />
          <div className="flex flex-col gap-2">
            {upcomingSessions.map((s) => (
              <CompactSessionCard key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}

      {/* Suggest a time */}
      <div className="mt-5">
        <GathrButton
          variant="secondary"
          size="sm"
          className="w-full gap-2"
          onClick={onOpenSuggest}
        >
          <Plus className="h-4 w-4" />
          Suggest a time
        </GathrButton>
      </div>

      {/* Past sessions */}
      {pastSessions.length > 0 && (
        <div className="mt-6">
          <SectionHeader title="Past sessions" />
          <div className="flex flex-col gap-2">
            {pastSessions.map((s) => (
              <PastSessionCard key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}

      {/* Suggest modal */}
      <AnimatePresence>
        {showSuggestModal && (
          <SuggestTimeModal onClose={onCloseSuggest} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CompactSessionCard({ session }: { session: (typeof SCHEDULED_SESSIONS)[number] }) {
  return (
    <div className="flex items-center justify-between bg-gathr-cream-dark rounded-card-sm px-4 py-3">
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
    <div className="bg-gathr-cream-dark/60 rounded-card-sm px-4 py-3 opacity-70">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gathr-charcoal font-body">
          {session.courseName}
        </p>
        <p className="text-xs text-gathr-warm-gray font-body">
          {session.date}
        </p>
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

function SuggestTimeModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={TRANSITION_SPRING}
        className="fixed bottom-0 inset-x-0 z-50 bg-gathr-cream rounded-t-2xl px-5 pt-5 pb-10 shadow-warm-lg"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-gathr-charcoal">
            Suggest a time
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gathr-cream-dark transition-colors text-gathr-warm-gray"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-body font-medium text-gathr-warm-gray uppercase tracking-wide">
              Date
            </span>
            <input
              type="date"
              className="w-full bg-gathr-cream-dark rounded-xl px-4 py-3 text-sm font-body text-gathr-charcoal border border-gathr-warm-gray-light focus:outline-none focus:border-gathr-amber transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-body font-medium text-gathr-warm-gray uppercase tracking-wide">
              Tee time
            </span>
            <input
              type="time"
              className="w-full bg-gathr-cream-dark rounded-xl px-4 py-3 text-sm font-body text-gathr-charcoal border border-gathr-warm-gray-light focus:outline-none focus:border-gathr-amber transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-body font-medium text-gathr-warm-gray uppercase tracking-wide">
              Course
            </span>
            <input
              type="text"
              placeholder="Course name or address"
              className="w-full bg-gathr-cream-dark rounded-xl px-4 py-3 text-sm font-body text-gathr-charcoal border border-gathr-warm-gray-light focus:outline-none focus:border-gathr-amber transition-colors placeholder:text-gathr-warm-gray-light"
            />
          </label>
          <GathrButton variant="primary" className="w-full mt-1" onClick={onClose}>
            Send suggestion
          </GathrButton>
        </div>
      </motion.div>
    </>
  );
}

// ─── Goals Tab ───────────────────────────────────────────────────────────────

interface GoalsTabProps {
  group: (typeof MATCH_GROUPS)[number];
  members: (typeof USERS)[number][];
}

function GoalsTab({ group, members }: GoalsTabProps) {
  const sharedGoals = group.coordinationSpace.sharedGoals;

  return (
    <motion.div
      key="goals"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={TRANSITION_GENTLE}
      className="px-4 pb-28"
    >
      {/* Shared group goals */}
      {sharedGoals.length > 0 && (
        <div className="mt-4">
          <SectionHeader title="Group goal" />
          {sharedGoals.map((goal) => {
            const allProgress = goal.memberProgress;
            const avgCurrent =
              allProgress.reduce((s, p) => s + p.current, 0) / allProgress.length;
            const avgTarget =
              allProgress.reduce((s, p) => s + p.target, 0) / allProgress.length;
            // Golf: lower score = better. target/current * 100 gives progress %.
            const overallPct = Math.min(100, Math.round((avgTarget / avgCurrent) * 100));

            return (
              <div
                key={goal.id}
                className="bg-gathr-cream-dark rounded-card-lg shadow-warm p-4 mb-3"
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

                {/* Per-member breakdown */}
                <div className="mt-4 flex flex-col gap-3">
                  {allProgress.map((mp) => {
                    const member = members.find((m) => m.id === mp.userId);
                    if (!member) return null;
                    const pct = Math.min(100, Math.round((mp.target / mp.current) * 100));
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

      {/* Member third objects */}
      <div className={sharedGoals.length > 0 ? "mt-5" : "mt-4"}>
        <SectionHeader title="Personal goals" />
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-3"
        >
          {members.map((member, i) => {
            const profile = member.activityProfiles.find(
              (p) => p.activityId === "golf",
            );
            if (!profile) return null;
            const mockPct = 30 + ((i * 17) % 55);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...TRANSITION_SPRING, delay: i * STAGGER_CHILDREN }}
                className="bg-gathr-cream-dark rounded-card-lg shadow-warm-sm p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <GathrAvatar
                    initials={member.firstName.charAt(0)}
                    size="xs"
                    alt={member.firstName}
                  />
                  <span className="text-sm font-body font-semibold text-gathr-charcoal">
                    {member.firstName}
                  </span>
                </div>
                <p className="text-sm font-body italic text-gathr-warm-gray leading-snug mb-3">
                  "{profile.thirdObject}"
                </p>
                <ProgressBar value={mockPct} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Shared UI helpers ───────────────────────────────────────────────────────

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
        className="h-full bg-gathr-amber rounded-full"
      />
    </div>
  );
}

// ─── Tiny utilities ──────────────────────────────────────────────────────────

function getFirstName(userId: string): string {
  return USERS.find((u) => u.id === userId)?.firstName ?? "Member";
}

function getInitials(userId: string): string {
  const name = getFirstName(userId);
  return name.charAt(0).toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
