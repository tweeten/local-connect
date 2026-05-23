import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { format } from "date-fns";
import {
  TopBar,
  SectionHeader,
  EmptyState,
  GroupCard,
  GathrButton,
} from "@/components/ui";
import {
  useGathr,
  useUserProfile,
} from "@/lib/GathrContext";
import { USERS, GOLF_ACTIVITY } from "@/lib/mock-data";
import {
  STAGGER_CONTAINER,
  STAGGER_ITEM,
  CARD_PRESS,
  TRANSITION_GENTLE,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/home")({
  component: HomeComponent,
  head: () => ({ meta: [{ title: "Gathr — Home" }] }),
});

// ─── Inline mock events lookup ────────────────────────────────────────────────

interface MockEvent {
  id: string;
  name: string;
  location: string;
  dateTime: string;
  groupName: string;
}

const MOCK_EVENTS: Record<string, MockEvent> = {
  "evt-smc-may24": {
    id: "evt-smc-may24",
    name: "Morning Round at Eastview",
    location: "Eastview Golf Course, Apple Valley",
    dateTime: "2026-05-24T07:06:00",
    groupName: "Saturday Morning Crew",
  },
  "evt-smc-may31": {
    id: "evt-smc-may31",
    name: "Morning Round — TBD",
    location: "TBD",
    dateTime: "2026-05-31T07:00:00",
    groupName: "Saturday Morning Crew",
  },
  "evt-smg-may25": {
    id: "evt-smg-may25",
    name: "Grinders Practice Round",
    location: "Hyland Greens Golf Club, Bloomington",
    dateTime: "2026-05-25T08:30:00",
    groupName: "South Metro Grinders",
  },
  "evt-tl-may26": {
    id: "evt-tl-may26",
    name: "Twilight League — Bearpath",
    location: "Bearpath Golf & Country Club, Eden Prairie",
    dateTime: "2026-05-26T16:30:00",
    groupName: "Twilight League",
  },
  "evt-tl-may28": {
    id: "evt-tl-may28",
    name: "Twilight League — Bearpath",
    location: "Bearpath Golf & Country Club, Eden Prairie",
    dateTime: "2026-05-28T16:30:00",
    groupName: "Twilight League",
  },
};

// ─── Child section: Staggered item wrapper ────────────────────────────────────

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={STAGGER_ITEM} className={className}>
      {children}
    </motion.div>
  );
}

// ─── HomeComponent ─────────────────────────────────────────────────────────────

function HomeComponent() {
  const { state, joinGroup } = useGathr();
  const { currentUser, matchGroups } = state;
  const golfProfile = useUserProfile("golf");
  const navigate = useNavigate();

  const today = new Date();
  const weekday = format(today, "EEEE").toUpperCase();

  // Groups the current user belongs to
  const myGroups = matchGroups.filter((g) =>
    g.memberIds.includes(currentUser.id),
  );

  // Groups that are forming and the user is NOT in
  const discoverGroups = matchGroups.filter(
    (g) => g.status === "forming" && !g.memberIds.includes(currentUser.id),
  );

  // Upcoming events from all user groups, max 3
  const upcomingEventIds = myGroups.flatMap(
    (g) => g.coordinationSpace.upcomingEvents,
  );
  const upcomingEvents = upcomingEventIds
    .map((id) => MOCK_EVENTS[id])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="h-full overflow-y-auto bg-gathr-cream">
      <TopBar showBell notificationDot />

      {/* Scrollable content */}
      <div className="px-4 pb-20" style={{ paddingTop: 72 }}>

        {/* ── Greeting ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_GENTLE}
          className="mb-8"
        >
          <h1 className="font-display text-2xl text-gathr-charcoal leading-tight">
            Hey, {currentUser.firstName}
          </h1>
          <p className="font-body text-sm text-gathr-warm-gray mt-0.5">
            {weekday} · {currentUser.neighborhood}
          </p>
          {currentUser.streakWeeks > 0 && (
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-gathr-forest/15 text-gathr-forest font-body text-xs font-semibold">
              🔥 {currentUser.streakWeeks}-week streak
            </span>
          )}
        </motion.div>

        {/* ── Your Groups ── */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <StaggerItem>
            <SectionHeader title="Your Groups" className="px-0" />
          </StaggerItem>

          {myGroups.length === 0 ? (
            <StaggerItem>
              <EmptyState
                headline="No groups yet"
                body="Complete your golf profile to get matched"
                ctaLabel="Set up my profile"
                onCta={() => navigate({ to: "/activity/$activitySlug/profile", params: { activitySlug: "golf" } })}
              />
            </StaggerItem>
          ) : (
            <StaggerItem>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
                {myGroups.map((group) => {
                  const groupMembers = group.memberIds
                    .map((uid) => USERS.find((x) => x.id === uid))
                    .filter((u): u is NonNullable<typeof u> => u != null);
                  return (
                    <div key={group.id} className="snap-start">
                      <GroupCard
                        group={group}
                        members={groupMembers}
                        activity={GOLF_ACTIVITY}
                        lastActivity={group.createdAt}
                        unreadCount={group.id === "mg-saturday-crew" ? 3 : 0}
                      />
                    </div>
                  );
                })}
              </div>
            </StaggerItem>
          )}
        </motion.section>

        {/* ── Up Next ── */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <StaggerItem>
            <SectionHeader
              title="Up Next"
              linkLabel="See all →"
              onLinkClick={() => navigate({ to: "/activity/$activitySlug", params: { activitySlug: "golf" } })}
            />
          </StaggerItem>

          {upcomingEvents.length === 0 ? (
            <StaggerItem>
              <EmptyState
                headline="Nothing on the calendar"
                body="Start something in your group — suggest a tee time or kick off a thread."
                ctaLabel="Open your group"
                onCta={() => myGroups[0] && navigate({ to: "/group/$groupId", params: { groupId: myGroups[0].id } })}
                className="py-6"
              />
            </StaggerItem>
          ) : (
            upcomingEvents.map((evt) => {
              const dt = new Date(evt.dateTime);
              const dayLabel = format(dt, "EEE").toUpperCase();
              const timeLabel = format(dt, "h:mm aa");
              return (
                <StaggerItem key={evt.id}>
                  <motion.div
                    {...CARD_PRESS}
                    className="flex items-center gap-3 bg-white/70 rounded-2xl shadow-warm-sm p-3 mb-2"
                  >
                    {/* Day + time */}
                    <div className="flex flex-col items-center justify-center w-14 shrink-0">
                      <span className="font-body text-[10px] font-semibold text-gathr-warm-gray leading-none">
                        {dayLabel}
                      </span>
                      <span className="font-body text-sm font-semibold text-gathr-charcoal mt-0.5 leading-none">
                        {timeLabel}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="w-px self-stretch bg-gathr-warm-gray/20 shrink-0" />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-gathr-charcoal truncate">
                        {evt.name}
                      </p>
                      <p className="font-body text-xs text-gathr-warm-gray truncate mt-0.5">
                        {evt.location}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gathr-amber/10 text-gathr-amber font-body text-[10px] font-semibold">
                        {evt.groupName}
                      </span>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })
          )}
        </motion.section>

        {/* ── Your Progress ── */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={STAGGER_CONTAINER}
          className="mb-8"
        >
          <StaggerItem>
            <SectionHeader title="Your Progress" />
          </StaggerItem>

          <StaggerItem>
            <div className="rounded-2xl bg-white/70 shadow-warm p-4 mb-3">
              {golfProfile?.thirdObject ? (
                <p className="font-display text-base text-gathr-charcoal italic leading-snug">
                  "{golfProfile.thirdObject}"
                </p>
              ) : (
                <p className="font-body text-sm text-gathr-warm-gray">
                  Set a goal in your golf profile.
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Rounds this month", value: "4" },
                { label: "Avg score", value: "94" },
                { label: "Group sessions", value: "3" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/70 shadow-warm-sm p-3 text-center"
                >
                  <p className="font-display text-xl text-gathr-charcoal">{stat.value}</p>
                  <p className="font-body text-[10px] text-gathr-warm-gray mt-0.5 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </StaggerItem>
        </motion.section>

        {/* ── Discover ── */}
        {discoverGroups.length > 0 && (
          <motion.section
            initial="initial"
            animate="animate"
            variants={STAGGER_CONTAINER}
            className="mb-8"
          >
            <StaggerItem>
              <SectionHeader
                title="Discover"
                linkLabel="See all →"
                onLinkClick={() => navigate({ to: "/activity/$activitySlug", params: { activitySlug: "golf" } })}
              />
            </StaggerItem>

            {discoverGroups.map((group) => {
              const spotsLeft =
                4 - group.memberIds.length > 0 ? 4 - group.memberIds.length : 1;

              // Derive score range from members' fieldValues
              const scores = group.memberIds
                .map((uid) => USERS.find((u) => u.id === uid))
                .flatMap((u) =>
                  u?.activityProfiles
                    .filter((p) => p.activityId === "golf")
                    .map((p) => p.fieldValues["skill-level"] as number) ?? [],
                )
                .filter(Boolean);
              const minScore = scores.length ? Math.min(...scores) : null;
              const maxScore = scores.length ? Math.max(...scores) : null;

              return (
                <StaggerItem key={group.id}>
                  <div className="rounded-2xl bg-white/70 shadow-warm p-4 mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-base text-gathr-charcoal truncate">
                          {group.name}
                        </p>
                        {minScore !== null && maxScore !== null && (
                          <p className="font-body text-xs text-gathr-warm-gray mt-0.5">
                            Avg score: {minScore}–{maxScore}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "ml-2 shrink-0 px-2 py-0.5 rounded-full font-body text-[10px] font-semibold",
                          "bg-gathr-forest/15 text-gathr-forest",
                        )}
                      >
                        Looking for {spotsLeft} more
                      </span>
                    </div>

                    <GathrButton
                      variant="primary"
                      size="sm"
                      className="w-full mt-1"
                      onClick={() => joinGroup(group.id)}
                    >
                      I'm in
                    </GathrButton>
                  </div>
                </StaggerItem>
              );
            })}
          </motion.section>
        )}
      </div>
    </div>
  );
}
