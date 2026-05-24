import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  TopBar,
  EmptyState,
  GroupCard,
  GathrButton,
  AvatarGroup,
} from "@/components/ui";
import { useGathr } from "@/lib/GathrContext";
import { USERS, GOLF_ACTIVITY, SCHEDULED_SESSIONS, MATCH_GROUPS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/home")({
  component: HomeComponent,
  head: () => ({ meta: [{ title: "Gathr — Home" }] }),
});

function HomeComponent() {
  const { state } = useGathr();
  const { currentUser, matchGroups } = state;
  const navigate = useNavigate();

  const [rsvp, setRsvp] = useState<"in" | "out" | null>(null);

  const today = new Date();
  const weekday = format(today, "EEEE").toUpperCase();

  const myGroups = matchGroups.filter((g) =>
    g.memberIds.includes(currentUser.id),
  );

  const myGroupIds = new Set(myGroups.map((g) => g.id));

  const nextSession =
    SCHEDULED_SESSIONS.filter(
      (s) => myGroupIds.has(s.matchGroupId) && s.status === "upcoming",
    )[0] ?? null;

  const nextSessionGroup = nextSession
    ? MATCH_GROUPS.find((g) => g.id === nextSession.matchGroupId) ?? null
    : null;

  const nextSessionAvatars = nextSession
    ? nextSession.confirmedMemberIds
        .map((uid) => USERS.find((u) => u.id === uid))
        .filter((u): u is NonNullable<typeof u> => u != null)
        .map((u) => ({
          src: u.avatarUrl,
          initials: u.firstName.slice(0, 2).toUpperCase(),
          alt: u.firstName,
        }))
    : [];

  return (
    <div className="h-full overflow-y-auto bg-gathr-cream">
      <TopBar showBell notificationDot />

      <div
        className="px-4 pb-20 sm:px-8 md:px-16 lg:max-w-2xl lg:mx-auto lg:px-8"
        style={{ paddingTop: 72 }}
      >
        {/* ── Greeting ── */}
        <div className="mb-8">
          <h1 className="font-display text-2xl text-gathr-charcoal leading-tight">
            Hey, {currentUser.firstName}
          </h1>
          <p className="font-body text-sm text-gathr-warm-gray mt-0.5">
            {weekday} · {currentUser.neighborhood}
          </p>
        </div>

        {/* ── Next Session ── */}
        <section className="mb-8">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-gathr-warm-gray mb-3">
            Next Session
          </h2>

          {nextSession === null ? (
            <EmptyState
              headline="Nothing on the calendar yet"
              body="Open your group to suggest a tee time or kick off a thread."
              ctaLabel="Open your group"
              onCta={() =>
                myGroups[0] &&
                navigate({
                  to: "/group/$groupId",
                  params: { groupId: myGroups[0].id },
                })
              }
              className="py-6"
            />
          ) : (
            <div className="bg-white/80 rounded-2xl shadow-warm p-4">
              {/* Course name + group pill */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-display text-lg text-gathr-charcoal leading-snug flex-1">
                  {nextSession.courseName}
                </h3>
                {nextSessionGroup && (
                  <span className="shrink-0 rounded-full bg-gathr-forest/10 text-gathr-forest px-2.5 py-1 font-body text-[10px] font-semibold">
                    {nextSessionGroup.name}
                  </span>
                )}
              </div>

              {/* Date + time */}
              <p className="font-body text-sm text-gathr-warm-gray mb-4">
                {nextSession.date} · {nextSession.time}
              </p>

              {/* Confirmed avatars */}
              {nextSessionAvatars.length > 0 && (
                <div className="flex items-center gap-2 mb-5">
                  <AvatarGroup avatars={nextSessionAvatars} max={5} size="xs" />
                  <span className="font-body text-xs text-gathr-warm-gray">
                    {nextSessionAvatars.length} confirmed
                  </span>
                </div>
              )}

              {/* RSVP buttons */}
              <div className="flex gap-2">
                <GathrButton
                  variant={rsvp === "in" ? "primary" : "secondary"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setRsvp(rsvp === "in" ? null : "in")}
                >
                  {rsvp === "in" ? "You're in ✓" : "I'm in"}
                </GathrButton>
                <GathrButton
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => setRsvp(rsvp === "out" ? null : "out")}
                >
                  {rsvp === "out" ? "Marked out" : "Can't make it"}
                </GathrButton>
              </div>
            </div>
          )}
        </section>

        {/* ── Your Groups ── */}
        <section className="mb-8">
          <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-gathr-warm-gray mb-3">
            Your Groups
          </h2>

          {myGroups.length === 0 ? (
            <EmptyState
              headline="No groups yet"
              body="Complete your golf profile to get matched"
              ctaLabel="Set up my profile"
              onCta={() =>
                navigate({
                  to: "/activity/$activitySlug/profile",
                  params: { activitySlug: "golf" },
                })
              }
            />
          ) : (
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
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
