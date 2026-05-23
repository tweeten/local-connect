import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { TopBar, CommunityCard, SectionHeader, GathrButton } from "@/components/ui";
import { COMMUNITIES } from "@/lib/gather-data";
import { useGathr } from "@/lib/GathrContext";
import { STAGGER_CHILDREN, STAGGER_CONTAINER, TRANSITION_DEFAULT, TRANSITION_SPRING } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/explore")({
  head: () => ({ meta: [{ title: "Gathr — Explore" }] }),
  component: ExploreScreen,
});

type Category = "Sports" | "Family" | "Outdoors" | "Food & drink" | "Fitness" | "Arts & culture";

const ALL_CATEGORIES: Category[] = [
  "Sports",
  "Family",
  "Outdoors",
  "Food & drink",
  "Fitness",
  "Arts & culture",
];

// Gradient backgrounds for trending cards, keyed by accent color
const TRENDING_GRADIENT: Record<string, string> = {
  amber:        "from-[#2D5F3F] to-[#3A7A52]",
  sage:         "from-[#D4893F] to-[#E8A85C]",
  coral:        "from-[#E07A5F] to-[#C4725A]",
  terracotta:   "from-[#C4725A] to-[#D4893F]",
  "dusty-blue": "from-[#6B8FA3] to-[#D4893F]",
};

function ExploreScreen() {
  const navigate = useNavigate();
  const { state, joinCommunity } = useGathr();
  const communities = state.communities;

  // First two categories expanded by default
  const [expandedCategories, setExpandedCategories] = useState<Set<Category>>(
    new Set(["Sports", "Family"]),
  );

  // Track in-flight joins for animation
  const [joiningIds, setJoiningIds] = useState<Set<string>>(new Set());

  function toggleCategory(cat: Category) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function handleJoin(id: string) {
    setJoiningIds((prev) => new Set(prev).add(id));
    joinCommunity(id);
    setTimeout(() => {
      setJoiningIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 800);
  }

  // Top 3 communities by weekly growth for trending section
  const trending = [...communities]
    .sort((a, b) => (b.weeklyGrowth ?? 0) - (a.weeklyGrowth ?? 0))
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col bg-gathr-cream">
      <TopBar />
      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div className="mx-auto max-w-4xl">

          {/* ── Trending near you ─────────────────────────────────────── */}
          <section className="pt-6 px-5">
            <SectionHeader title="Trending near you" />

            {/* Mobile: horizontal scroll | Desktop: 4-column grid */}
            <div className="-mx-5 px-5 overflow-x-auto md:overflow-visible md:mx-0 md:px-0">
              <motion.div
                className="flex gap-3 pb-2 md:grid md:grid-cols-4"
                initial="initial"
                animate="animate"
                variants={{
                  animate: { transition: { staggerChildren: STAGGER_CHILDREN } },
                }}
              >
                {trending.map((community) => (
                  <motion.div
                    key={community.id}
                    variants={{
                      initial: { opacity: 0, x: 24 },
                      animate: { opacity: 1, x: 0, transition: TRANSITION_DEFAULT },
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={TRANSITION_SPRING}
                    onClick={() => navigate({ to: "/community/$communityId", params: { communityId: community.id } })}
                    className="shrink-0 w-40 h-[200px] md:w-auto rounded-card-lg overflow-hidden relative flex flex-col justify-end p-4 cursor-pointer"
                  >
                    {/* Gradient background */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br",
                        TRENDING_GRADIENT[community.accentColor] ?? "from-gathr-amber to-gathr-terracotta",
                      )}
                    />
                    {/* Subtle dark overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Content */}
                    <div className="relative z-10">
                      <p className="text-lg font-semibold text-white leading-tight">
                        {community.name}
                      </p>
                      <p className="mt-1 text-sm text-white/80">
                        {community.memberCount.toLocaleString()} members
                      </p>
                      {community.weeklyGrowth !== undefined && (
                        <p className="text-sm text-white/80">
                          ↑ {community.weeklyGrowth} this week
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── All communities by category ───────────────────────────── */}
          <section className="mt-8 px-5">
            <SectionHeader title="All communities" />

            <div className="space-y-2">
              {ALL_CATEGORIES.map((category) => {
                const catCommunities = communities.filter(
                  (c) => c.category === category,
                );
                if (catCommunities.length === 0) return null;

                const isExpanded = expandedCategories.has(category);

                return (
                  <div key={category}>
                    {/* Category header */}
                    <motion.button
                      onClick={() => toggleCategory(category)}
                      whileTap={{ scale: 0.98 }}
                      transition={TRANSITION_SPRING}
                      className="flex w-full items-center justify-between py-2"
                    >
                      <span className="text-sm font-semibold text-gathr-warm-gray">
                        {category}
                        <span className="ml-2 font-normal tracking-normal">
                          ({catCommunities.length})
                        </span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gathr-warm-gray-light" strokeWidth={1.75} />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gathr-warm-gray-light" strokeWidth={1.75} />
                      )}
                    </motion.button>

                    {/* Collapsible community list */}
                    {isExpanded && (
                      <motion.div
                        className="pb-3 space-y-2"
                        variants={STAGGER_CONTAINER}
                        initial="initial"
                        animate="animate"
                      >
                        {catCommunities.slice(0, 3).map((c) => (
                          <motion.div
                            key={c.id}
                            variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT } }}
                          >
                          <CommunityCard
                            key={c.id}
                            id={c.id}
                            name={c.name}
                            memberCount={c.memberCount}
                            activity={c.activityPulse}
                            activityType={
                              c.activityPulse.toLowerCase().includes("event") ||
                              c.activityPulse.toLowerCase().includes("going") ||
                              c.activityPulse.toLowerCase().includes("tailgate") ||
                              c.activityPulse.toLowerCase().includes("hike") ||
                              c.activityPulse.toLowerCase().includes("run") ||
                              c.activityPulse.toLowerCase().includes("game") ||
                              c.activityPulse.toLowerCase().includes("class") ||
                              c.activityPulse.toLowerCase().includes("pickup")
                                ? "event"
                                : "conversation"
                            }
                            accent={c.accentColor}
                            suggested={!c.isJoined}
                            suggestionLine={c.suggestionLine}
                            joining={joiningIds.has(c.id)}
                            onJoin={!c.isJoined ? handleJoin : undefined}
                          />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Bottom CTA card ───────────────────────────────────────── */}
          <section className="mt-8 mx-5 mb-4">
            <div className="rounded-card-lg bg-gathr-cream-dark p-6 text-center">
              <h3 className="font-display text-lg text-gathr-charcoal">
                Don't see what you're looking for?
              </h3>
              <p className="mt-2 text-sm text-gathr-warm-gray">
                Start your own community and see who shows up.
              </p>
              <div className="mt-4 flex justify-center">
                <GathrButton
                  variant="secondary"
                  size="sm"
                  onClick={() => alert("Start a community — coming soon!")}
                >
                  Start a community
                </GathrButton>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
