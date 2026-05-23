import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Users, ChevronRight } from "lucide-react";
import {
  TopBar,
  GathrAvatar,
  SectionHeader,
  EmptyState,
  GathrButton,
} from "@/components/ui";
import { useGathr } from "@/lib/GathrContext";
import { USERS } from "@/lib/mock-data";
import {
  STAGGER_CONTAINER,
  STAGGER_CHILDREN,
  TRANSITION_SPRING,
  TRANSITION_GENTLE,
  CARD_PRESS,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/groups")({
  component: GroupsComponent,
  head: () => ({ meta: [{ title: "Gathr — Groups" }] }),
});

function GroupsComponent() {
  const { state, joinGroup } = useGathr();
  const { currentUser, matchGroups } = state;
  const navigate = useNavigate();

  const myGroups = matchGroups.filter((g) =>
    g.memberIds.includes(currentUser.id),
  );

  const discoverGroups = matchGroups.filter(
    (g) => g.status === "forming" && !g.memberIds.includes(currentUser.id),
  );

  return (
    <div className="min-h-screen bg-gathr-cream overflow-y-auto">
      <TopBar title="Groups" showBell={false} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={TRANSITION_GENTLE}
        className="px-4 pb-28"
        style={{ paddingTop: 72 }}
      >
        {/* ── Your Groups ─────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader title="Your Groups" className="px-0" />

          {myGroups.length === 0 ? (
            <EmptyState
              headline="No groups yet"
              body="Complete your golf profile to get matched with players near you."
              ctaLabel="Set up my profile"
              onCta={() =>
                navigate({
                  to: "/activity/$activitySlug/profile",
                  params: { activitySlug: "golf" },
                })
              }
            />
          ) : (
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-3"
            >
              {myGroups.map((group, i) => {
                const members = group.memberIds
                  .map((id) => USERS.find((u) => u.id === id))
                  .filter(Boolean) as (typeof USERS)[number][];

                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANSITION_SPRING, delay: i * STAGGER_CHILDREN }}
                  >
                    <GroupRow
                      group={group}
                      members={members}
                      onPress={() =>
                        navigate({
                          to: "/group/$groupId",
                          params: { groupId: group.id },
                        })
                      }
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        {/* ── Discover ─────────────────────────────────────────────────── */}
        {discoverGroups.length > 0 && (
          <section className="mb-8">
            <SectionHeader title="Discover" className="px-0" />

            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-3"
            >
              {discoverGroups.map((group, i) => {
                const spotsLeft = Math.max(1, 4 - group.memberIds.length);
                const scores = group.memberIds
                  .map((uid) => USERS.find((u) => u.id === uid))
                  .flatMap(
                    (u) =>
                      u?.activityProfiles
                        .filter((p) => p.activityId === "golf")
                        .map((p) => p.fieldValues["skill-level"] as number) ??
                      [],
                  )
                  .filter(Boolean);
                const minScore = scores.length ? Math.min(...scores) : null;
                const maxScore = scores.length ? Math.max(...scores) : null;

                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...TRANSITION_SPRING,
                      delay: (myGroups.length + i) * STAGGER_CHILDREN,
                    }}
                    className="rounded-2xl bg-gathr-cream-dark shadow-warm p-4"
                  >
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
                      <span className="ml-2 shrink-0 px-2 py-0.5 rounded-full bg-gathr-forest/15 text-gathr-forest font-body text-[10px] font-semibold">
                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
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
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        )}
      </motion.div>
    </div>
  );
}

// ─── GroupRow ─────────────────────────────────────────────────────────────────

interface GroupRowProps {
  group: {
    id: string;
    name: string;
    status: string;
    matchScore: number;
    memberIds: string[];
  };
  members: (typeof USERS)[number][];
  onPress: () => void;
}

function GroupRow({ group, members, onPress }: GroupRowProps) {
  return (
    <motion.button
      {...CARD_PRESS}
      onClick={onPress}
      className="w-full text-left bg-gathr-cream-dark rounded-2xl shadow-warm p-4 flex items-center gap-3"
    >
      {/* Avatar stack */}
      <div className="flex -space-x-2 shrink-0">
        {members.slice(0, 4).map((m) => (
          <GathrAvatar
            key={m.id}
            initials={m.firstName.charAt(0)}
            size="sm"
            alt={m.firstName}
            className={cn(
              "ring-2 ring-gathr-cream",
            )}
          />
        ))}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-base text-gathr-charcoal truncate">
          {group.name}
        </p>
        <p className="font-body text-xs text-gathr-warm-gray mt-0.5">
          {members.length} members · {group.matchScore}% match
        </p>
      </div>

      {/* Chevron */}
      <ChevronRight className="h-4 w-4 text-gathr-warm-gray-light shrink-0" />
    </motion.button>
  );
}
