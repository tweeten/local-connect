import { useState, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { TopBar, CommunityCard, SectionHeader, EmptyState } from "@/components/ui";
import { useGathr } from "@/lib/GathrContext";
import { STAGGER_CHILDREN, TRANSITION_DEFAULT } from "@/lib/design-tokens";
import type { Community } from "@/lib/gather-data";

export const Route = createFileRoute("/_app/communities")({
  head: () => ({ meta: [{ title: "Gathr — Your communities" }] }),
  component: CommunitiesScreen,
});

function getActivityType(pulse: string): "event" | "conversation" {
  return /going|event|happening|tailgate|playdate|night|run|pickup|zoo|weekend/i.test(
    pulse,
  )
    ? "event"
    : "conversation";
}

function CommunitiesScreen() {
  const { state, joinCommunity } = useGathr();
  const navigate = useNavigate();

  // Track IDs that are mid-join animation (glow + checkmark showing)
  const [joiningIds, setJoiningIds] = useState<Set<string>>(new Set());

  const joined = state.communities.filter((c) => c.isJoined);
  const suggested = state.communities.filter((c) => !c.isJoined);

  const handleJoin = useCallback(
    (id: string) => {
      // Start glow + checkmark animation
      setJoiningIds((prev) => new Set(prev).add(id));

      // After 500ms: commit to context (card moves to joined section via layout animation)
      setTimeout(() => {
        joinCommunity(id);
        setJoiningIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 500);
    },
    [joinCommunity],
  );

  const handlePress = useCallback(
    (id: string) => {
      navigate({ to: "/community/$communityId", params: { communityId: id } });
    },
    [navigate],
  );

  const handleSeeAll = useCallback(() => {
    navigate({ to: "/explore" });
  }, [navigate]);

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (joined.length === 0) {
    return (
      <div className="h-full flex flex-col bg-background">
        <TopBar showSearch />
      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div className="px-5 pt-6">
            <EmptyState
              headline="No communities yet"
              body="Here's what's popular near you"
            />
            <motion.div
              className="mt-2 flex flex-col gap-3"
              initial="initial"
              animate="animate"
              variants={{
                animate: { transition: { staggerChildren: STAGGER_CHILDREN } },
              }}
            >
              {suggested.map((community) => (
                <CardItem
                  key={community.id}
                  community={community}
                  joining={joiningIds.has(community.id)}
                  onPress={handlePress}
                  onJoin={handleJoin}
                />
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // ── Normal state ─────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar showSearch />
      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div>
          {/* Section 1: Your Communities */}
          <div className="px-5 pt-6 pb-2">
            <SectionHeader title="Your communities" />
          </div>

          <motion.div
            className="px-5 flex flex-col gap-3 pb-2"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: STAGGER_CHILDREN } },
            }}
          >
            <AnimatePresence>
              {joined.map((community) => (
                <CardItem
                  key={community.id}
                  community={community}
                  joining={false}
                  onPress={handlePress}
                  onJoin={handleJoin}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Section 2: Find something new */}
          {suggested.length > 0 && (
            <div className="mt-8 bg-gathr-cream-dark">
              <div className="px-5 pt-6 pb-2">
                <SectionHeader
                  title="Find something new"
                  linkLabel="See all →"
                  onLinkClick={handleSeeAll}
                />
              </div>

              <motion.div
                className="px-5 flex flex-col gap-3 pb-8"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: STAGGER_CHILDREN,
                      delayChildren: joined.length * STAGGER_CHILDREN,
                    },
                  },
                }}
              >
                <AnimatePresence>
                  {suggested.map((community) => (
                    <CardItem
                      key={community.id}
                      community={community}
                      joining={joiningIds.has(community.id)}
                      onPress={handlePress}
                      onJoin={handleJoin}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Animated card wrapper ─────────────────────────────────────────────────────

interface CardItemProps {
  community: Community;
  joining: boolean;
  onPress: (id: string) => void;
  onJoin: (id: string) => void;
}

function CardItem({ community, joining, onPress, onJoin }: CardItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={TRANSITION_DEFAULT}
    >
      <CommunityCard
        id={community.id}
        name={community.name}
        memberCount={community.memberCount}
        activity={community.activityPulse}
        activityType={getActivityType(community.activityPulse)}
        accent={community.accentColor}
        suggested={!community.isJoined}
        suggestionLine={community.suggestionLine}
        joining={joining}
        onPress={onPress}
        onJoin={onJoin}
      />
    </motion.div>
  );
}
