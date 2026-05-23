import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Settings,
  MapPin,
  Plus,
  ChevronDown,
  ChevronUp,
  Send,
  X,
} from "lucide-react";
import { TopBar, PillChip, ThreadCard, GathrAvatar } from "@/components/ui";
import {
  COMMUNITIES,
  THREADS,
  RECOMMENDATIONS,
  CURRENT_USER,
  getUserInitials,
  formatEventDate,
} from "@/lib/gather-data";
import { useGathr } from "@/lib/GathrContext";
import {
  STAGGER_CONTAINER,
  TRANSITION_DEFAULT,
  TRANSITION_SPRING,
} from "@/lib/design-tokens";

export const Route = createFileRoute("/_app/community/$communityId")({
  component: CommunityDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl">Community not found</h1>
        <Link
          to="/communities"
          className="mt-3 inline-block text-primary underline"
        >
          Back to communities
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-muted-foreground">{error.message}</div>
  ),
  loader: ({ params }) => {
    const community = COMMUNITIES.find((c) => c.id === params.communityId);
    if (!community) throw notFound();
    return { community };
  },
});

// ─── Accent color → gradient stop colors ─────────────────────────────────────

const ACCENT_GRADIENT: Record<string, [string, string]> = {
  amber:      ["#2D5F3F", "#3A7A52"],
  sage:       ["#7BA587", "#96BDA1"],
  coral:      ["#E07A5F", "#E8967E"],
  terracotta: ["#C4725A", "#D49278"],
  "dusty-blue": ["#6B8FA3", "#8BAAB9"],
};

type Tab = "conversations" | "events" | "recs";
type RecCategory = "All" | "Places" | "Tips" | "Food & drink" | "Gear";

const REC_CATEGORIES: RecCategory[] = ["All", "Places", "Tips", "Food & drink", "Gear"];
const REC_CAT_MAP: Record<RecCategory, string | null> = {
  All: null,
  Places: "places",
  Tips: "tips",
  "Food & drink": "food-drink",
  Gear: "gear",
};

// ─── Compose modal ────────────────────────────────────────────────────────────

function ComposeModal({
  onClose,
  onPost,
}: {
  onClose: () => void;
  onPost: (title: string, body: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-gathr-charcoal/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={TRANSITION_DEFAULT}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-gathr-cream shadow-warm-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-gathr-charcoal">New conversation</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => title.trim() && onPost(title, body)}
              disabled={!title.trim()}
              className="rounded-full bg-gathr-amber px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-40 transition"
            >
              Post
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gathr-cream-dark transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gathr-warm-gray" />
            </button>
          </div>
        </div>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border-b-2 border-gathr-warm-gray-light focus:border-gathr-amber bg-transparent text-lg text-gathr-charcoal placeholder:text-gathr-warm-gray-light outline-none pb-2 mb-4 transition-colors"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full rounded-card-sm border border-gathr-warm-gray-light focus:border-gathr-amber bg-transparent text-base text-gathr-charcoal placeholder:text-gathr-warm-gray-light outline-none p-3 resize-none transition-colors"
        />
      </motion.div>
    </div>
  );
}

// ─── Share rec modal ──────────────────────────────────────────────────────────

function ShareRecModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const cats = ["Places", "Tips", "Food & drink", "Gear"];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-gathr-charcoal/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={TRANSITION_DEFAULT}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-gathr-cream shadow-warm-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-gathr-charcoal">Share a rec</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gathr-cream-dark transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gathr-warm-gray" />
          </button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you want to share? A place, a tip, something useful..."
          rows={3}
          className="w-full rounded-card-sm border border-gathr-warm-gray-light focus:border-gathr-amber bg-transparent text-base text-gathr-charcoal placeholder:text-gathr-warm-gray-light outline-none p-3 resize-none transition-colors mb-3"
        />

        <div className="relative mb-3">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gathr-warm-gray pointer-events-none" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add a location (optional)"
            className="w-full rounded-full border border-gathr-warm-gray-light focus:border-gathr-amber bg-transparent pl-9 pr-4 py-2 text-sm text-gathr-charcoal placeholder:text-gathr-warm-gray-light outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {cats.map((c) => (
            <PillChip
              key={c}
              label={c}
              active={category === c}
              onToggle={() => setCategory(category === c ? null : c)}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          disabled={!text.trim() || !category}
          className="w-full rounded-full bg-gathr-amber py-3 text-sm font-semibold text-white disabled:opacity-40 transition"
        >
          Share
        </button>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function CommunityDetail() {
  const { community } = Route.useLoaderData();
  const { communityId } = Route.useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("conversations");
  const [showCompose, setShowCompose] = useState(false);
  const [showShareRec, setShowShareRec] = useState(false);
  const [pastExpanded, setPastExpanded] = useState(false);
  const [recCategory, setRecCategory] = useState<RecCategory>("All");
  const [upvotedRecs, setUpvotedRecs] = useState<Set<string>>(new Set());
  const [recUpvoteCounts, setRecUpvoteCounts] = useState<Record<string, number>>({});
  const [tabsStuck, setTabsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { state, toggleAttendance } = useGathr();

  const liveCommunity =
    state.communities.find((c) => c.id === communityId) ?? community;

  const now = new Date();
  const allCommunityEvents = state.events.filter((e) => e.communityId === communityId);
  const upcomingEvents = allCommunityEvents.filter(
    (e) => new Date(e.dateTime) >= now
  );
  const pastEvents = allCommunityEvents.filter(
    (e) => new Date(e.dateTime) < now
  );

  const communityThreads = [...THREADS.filter((t) => t.communityId === communityId)].sort(
    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );

  const allCommunityRecs = RECOMMENDATIONS.filter((r) => r.communityId === communityId);
  const filteredRecs =
    recCategory === "All"
      ? allCommunityRecs
      : allCommunityRecs.filter((r) => r.category === REC_CAT_MAP[recCategory]);

  const [from, to] = ACCENT_GRADIENT[liveCommunity.accentColor] ?? ACCENT_GRADIENT.amber;

  // Sticky tab detection via IntersectionObserver on a sentinel above the tabs
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setTabsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function handleUpvoteRec(recId: string, baseCount: number) {
    setUpvotedRecs((prev) => {
      const next = new Set(prev);
      if (next.has(recId)) {
        next.delete(recId);
        setRecUpvoteCounts((c) => ({ ...c, [recId]: (c[recId] ?? baseCount) - 1 }));
      } else {
        next.add(recId);
        setRecUpvoteCounts((c) => ({ ...c, [recId]: (c[recId] ?? baseCount) + 1 }));
      }
      return next;
    });
  }

  return (
    <div className="h-full flex flex-col bg-gathr-cream">
      {/* Overlay TopBar — sits on top of the banner */}
      <TopBar
        back="/communities"
        overlay
        showBell={false}
        rightAction={
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-gathr-cream/90 hover:bg-white/15 transition-colors"
            aria-label="Community settings"
          >
            <Settings className="h-5 w-5" strokeWidth={1.75} />
          </button>
        }
      />

      {/* Gradient banner */}
      <div
        className="relative shrink-0 flex items-end px-4 pb-3 pt-16"
        style={{
          height: 140,
          background: `linear-gradient(135deg, ${from}, ${to})`,
        }}
      >
        <div>
          <h1 className="font-display text-2xl font-semibold text-white leading-tight">
            {liveCommunity.name}
          </h1>
          <p className="mt-0.5 text-sm text-white/80">
            {liveCommunity.memberCount.toLocaleString()} members · {liveCommunity.description}
          </p>
        </div>
      </div>

      {/* Sentinel for sticky detection */}
      <div ref={sentinelRef} className="h-px" />

      {/* Sticky tab bar */}
      <div
        className={`sticky top-16 z-40 flex justify-center gap-2 px-4 py-3 bg-gathr-cream transition-shadow ${
          tabsStuck ? "shadow-warm-sm" : ""
        }`}
      >
        {(["conversations", "events", "recs"] as Tab[]).map((t) => (
          <PillChip
            key={t}
            label={t.charAt(0).toUpperCase() + t.slice(1)}
            active={tab === t}
            onToggle={() => setTab(t)}
          />
        ))}
      </div>

      {/* Scrollable tab content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {tab === "conversations" && (
            <motion.div
              key="conversations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={TRANSITION_DEFAULT}
              className="px-4 pt-2 space-y-3"
            >
              {/* Compose prompt bar */}
              <motion.div
                className="flex items-center gap-3 rounded-2xl bg-gathr-cream-dark px-4 py-3 shadow-warm-sm cursor-pointer"
                onClick={() => setShowCompose(true)}
                whileTap={{ scale: 0.98 }}
                transition={TRANSITION_SPRING}
              >
                <GathrAvatar
                  initials={getUserInitials(CURRENT_USER)}
                  size="sm"
                />
                <span className="flex-1 text-sm text-gathr-warm-gray">
                  Start a conversation...
                </span>
              </motion.div>

              {/* Thread list */}
              {communityThreads.length === 0 ? (
                <p className="py-8 text-center text-sm text-gathr-warm-gray">
                  No conversations yet. Start one above.
                </p>
              ) : (
                <motion.div
                  variants={STAGGER_CONTAINER}
                  initial="initial"
                  animate="animate"
                  className="space-y-3"
                >
                  {communityThreads.map((thread) => (
                    <motion.div
                      key={thread.id}
                      variants={{
                        initial: { opacity: 0, y: 8 },
                        animate: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                        },
                      }}
                    >
                      <ThreadCard
                        id={thread.id}
                        poster={{ initials: getUserInitials(thread.author) }}
                        posterName={thread.author.firstName}
                        title={thread.title}
                        preview={thread.preview}
                        replyCount={thread.replyCount}
                        timestamp={new Date(thread.lastActivity).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        upvotes={thread.upvotes}
                        onPress={() =>
                          navigate({
                            to: "/community/$communityId/thread/$threadId",
                            params: { communityId, threadId: thread.id },
                          })
                        }
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={TRANSITION_DEFAULT}
              className="px-4 pt-2 space-y-3"
            >
              {upcomingEvents.length === 0 ? (
                <p className="py-8 text-center text-sm text-gathr-warm-gray">
                  Nothing scheduled yet. Be the first to start something.
                </p>
              ) : (
                <motion.div
                  className="space-y-3"
                  variants={STAGGER_CONTAINER}
                  initial="initial"
                  animate="animate"
                >
                  {upcomingEvents.map((e) => (
                    <motion.div
                      key={e.id}
                      variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT } }}
                      className="rounded-2xl bg-gathr-cream-dark shadow-warm-sm ring-1 ring-gathr-warm-gray-light/40"
                    >
                      <Link
                        to="/event/$eventId"
                        params={{ eventId: e.id }}
                        className="block p-4"
                      >
                        <div className="flex items-center justify-between text-[11px] text-gathr-warm-gray">
                          <span>{formatEventDate(e.dateTime)}</span>
                          <span>{e.totalAttendees} going</span>
                        </div>
                        <p className="mt-1 font-display text-base text-gathr-charcoal">
                          {e.name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gathr-warm-gray">
                          <MapPin className="h-3 w-3" strokeWidth={1.75} /> {e.location}
                        </p>
                      </Link>
                      <div className="border-t border-gathr-warm-gray-light/30 px-4 py-2">
                        <motion.button
                          onClick={() => toggleAttendance(e.id)}
                          whileTap={{ scale: 0.98 }}
                          transition={TRANSITION_SPRING}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            e.isAttending
                              ? "bg-gathr-sage/15 text-gathr-forest ring-1 ring-gathr-sage/40"
                              : "bg-gathr-amber/10 text-gathr-amber hover:bg-gathr-amber/15"
                          }`}
                        >
                          {e.isAttending ? "You're going ✓" : "Count me in"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Past events collapsible */}
              {pastEvents.length > 0 && (
                <div className="pt-2">
                  <motion.button
                    onClick={() => setPastExpanded((p) => !p)}
                    whileTap={{ scale: 0.98 }}
                    transition={TRANSITION_SPRING}
                    className="flex w-full items-center justify-between py-3 text-sm font-medium text-gathr-warm-gray hover:text-gathr-charcoal transition-colors"
                  >
                    <span>Past events</span>
                    <motion.span
                      animate={{ rotate: pastExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {pastExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden space-y-3"
                      >
                        {pastEvents.map((e) => (
                          <div
                            key={e.id}
                            className="opacity-60 rounded-2xl bg-gathr-cream-dark shadow-warm-sm ring-1 ring-gathr-warm-gray-light/40 p-4"
                          >
                            <div className="flex items-center justify-between text-[11px] text-gathr-warm-gray">
                              <span>{formatEventDate(e.dateTime)}</span>
                              <span>{e.totalAttendees} people gathered</span>
                            </div>
                            <p className="mt-1 font-display text-base text-gathr-charcoal">
                              {e.name}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gathr-warm-gray">
                              <MapPin className="h-3 w-3" strokeWidth={1.75} /> {e.location}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {tab === "recs" && (
            <motion.div
              key="recs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={TRANSITION_DEFAULT}
              className="px-4 pt-2"
            >
              {/* Category filter chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
                {REC_CATEGORIES.map((c) => (
                  <PillChip
                    key={c}
                    label={c}
                    active={recCategory === c}
                    onToggle={() => setRecCategory(c)}
                  />
                ))}
              </div>

              {/* Compose prompt */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gathr-warm-gray">Know something useful?</p>
                <button
                  onClick={() => setShowShareRec(true)}
                  className="text-sm font-semibold text-gathr-amber hover:text-gathr-amber-light transition-colors"
                >
                  Share
                </button>
              </div>

              {/* Rec cards */}
              <motion.div
                className="space-y-0"
                variants={STAGGER_CONTAINER}
                initial="initial"
                animate="animate"
              >
                {filteredRecs.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gathr-warm-gray">
                    No recs in this category yet.
                  </p>
                ) : (
                  filteredRecs.map((r, i) => {
                    const isUpvoted = upvotedRecs.has(r.id);
                    const count = recUpvoteCounts[r.id] ?? r.upvotes;
                    return (
                      <motion.div
                        key={r.id}
                        variants={{ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT } }}
                      >
                        <div className="py-4">
                          <div className="flex items-start gap-3">
                            <GathrAvatar
                              initials={getUserInitials(r.author)}
                              size="xs"
                              className="mt-0.5"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gathr-charcoal">
                                  {r.author.firstName}
                                </span>
                                <span className="rounded-full bg-gathr-cream-dark px-2 py-0.5 text-[10px] text-gathr-warm-gray capitalize border border-gathr-warm-gray-light/50">
                                  {r.category.replace("-", " ")}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gathr-charcoal leading-relaxed">
                                {r.text}
                              </p>
                              {r.location && (
                                <p className="mt-1.5 flex items-center gap-1 text-xs text-gathr-warm-gray">
                                  <MapPin className="h-3 w-3" strokeWidth={1.75} />
                                  {r.location}
                                </p>
                              )}
                              <div className="mt-2 flex items-center justify-between">
                                <motion.button
                                  onClick={() => handleUpvoteRec(r.id, r.upvotes)}
                                  whileTap={{ scale: 0.98 }}
                                  transition={TRANSITION_SPRING}
                                  aria-label="Upvote"
                                  className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                                    isUpvoted
                                      ? "text-gathr-amber"
                                      : "text-gathr-warm-gray hover:text-gathr-amber"
                                  }`}
                                >
                                  <motion.span
                                    animate={isUpvoted ? { y: [-3, 0] } : { y: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
                                  </motion.span>
                                  <motion.span
                                    key={count}
                                    initial={{ y: -6, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    {count}
                                  </motion.span>
                                </motion.button>
                                <span className="text-xs text-gathr-warm-gray">
                                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {i < filteredRecs.length - 1 && (
                          <div className="h-px bg-gathr-warm-gray-light/50" />
                        )}
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAB — only visible on events tab */}
      <AnimatePresence>
        {tab === "events" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed bottom-[84px] right-4 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => navigate({ to: "/create" })}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gathr-amber shadow-warm text-white"
              aria-label="Create event"
            >
              <Plus className="h-6 w-6" strokeWidth={2} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showCompose && (
          <ComposeModal
            onClose={() => setShowCompose(false)}
            onPost={() => setShowCompose(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareRec && (
          <ShareRecModal onClose={() => setShowShareRec(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
