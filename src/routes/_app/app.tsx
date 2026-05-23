import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleMap } from "@/components/GoogleMap";
import { TopBar, PillChip, EventCard } from "@/components/ui";
import { EVENTS, formatEventDate, type GathrEvent } from "@/lib/gather-data";
import { useGathr } from "@/lib/GathrContext";
import { STAGGER_CONTAINER, TRANSITION_DEFAULT, TRANSITION_SPRING } from "@/lib/design-tokens";
import type { AvatarGroupItem } from "@/components/ui";

// ── Snap point ratios (fraction of viewport height the sheet occupies) ────────
const SNAPS = { peek: 0.20, default: 0.45, full: 0.85 } as const;
type SnapPoint = keyof typeof SNAPS;

// ── Category → communityId mapping for filter chips ──────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  Family:         ["family"],
  Sports:         ["vikings", "twins", "wild", "pickup"],
  Outdoors:       ["outdoor"],
  "Food & drink": ["food", "breweries"],
};

const FILTER_LABELS = ["This weekend", "Family", "Free", "Sports", "Outdoors", "Food & drink"];

function isThisWeekend(dateTime: string) {
  const d = new Date(dateTime);
  return d.getDay() === 6 || d.getDay() === 0; // Saturday or Sunday
}

function toAvatarItems(event: GathrEvent): AvatarGroupItem[] {
  return event.attendees.slice(0, 4).map((a) => ({
    initials: a.firstName.slice(0, 2).toUpperCase(),
  }));
}

export const Route = createFileRoute("/_app/app")({
  head: () => ({ meta: [{ title: "Gathr — Happening near you" }] }),
  component: AppScreen,
});

function AppScreen() {
  const { state } = useGathr();
  const navigate = useNavigate();

  // ── Active map pin ──────────────────────────────────────────────────────────
  const [activeId, setActiveId] = useState<string>("vikes");

  // ── Filter state ────────────────────────────────────────────────────────────
  const [weekendActive, setWeekendActive] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // ── Desktop detection ───────────────────────────────────────────────────────
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Viewport height for snap math ───────────────────────────────────────────
  const [vh, setVh] = useState(800);
  useEffect(() => {
    setVh(window.innerHeight);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const snapHeights = useMemo(
    () => ({
      peek:    Math.round(vh * SNAPS.peek),
      default: Math.round(vh * SNAPS.default),
      full:    Math.round(vh * SNAPS.full),
    }),
    [vh],
  );

  // ── Bottom sheet drag state ─────────────────────────────────────────────────
  const [snapPoint, setSnapPoint] = useState<SnapPoint>("default");
  // dragDelta: pixels the user has dragged from the snap height; null = not dragging
  const [dragDelta, setDragDelta] = useState<number | null>(null);
  const dragStartRef = useRef<{ y: number } | null>(null);

  const sheetHeight =
    dragDelta !== null
      ? Math.max(
          snapHeights.peek  - 40,
          Math.min(snapHeights.full + 40, snapHeights[snapPoint] + dragDelta),
        )
      : snapHeights[snapPoint];

  const onHandlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { y: e.clientY };
    setDragDelta(0);
  };

  const onHandlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    // Dragging up (negative clientY delta) = larger sheet height
    setDragDelta(dragStartRef.current.y - e.clientY);
  };

  const onHandlePointerUp = () => {
    if (dragStartRef.current === null) return;
    const finalH = sheetHeight;
    const closest = (Object.keys(snapHeights) as SnapPoint[]).reduce(
      (best, k) =>
        Math.abs(snapHeights[k] - finalH) < Math.abs(snapHeights[best] - finalH)
          ? k
          : best,
      "default" as SnapPoint,
    );
    dragStartRef.current = null;
    setDragDelta(null);
    setSnapPoint(closest);
  };

  const dragHandlers = {
    onPointerDown:  onHandlePointerDown,
    onPointerMove:  onHandlePointerMove,
    onPointerUp:    onHandlePointerUp,
    onPointerCancel: onHandlePointerUp,
  };

  // ── Welcome overlay ─────────────────────────────────────────────────────────
  const [showWelcome, setShowWelcome] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("gathr-welcomed")) setShowWelcome(true);
  }, []);
  const dismissWelcome = () => {
    localStorage.setItem("gathr-welcomed", "1");
    setShowWelcome(false);
  };

  // ── Sorted + filtered events ─────────────────────────────────────────────────
  const joinedIds = useMemo(
    () => new Set(state.communities.filter((c) => c.isJoined).map((c) => c.id)),
    [state.communities],
  );

  const filteredEvents = useMemo(() => {
    let evts = [...state.events];

    if (weekendActive) evts = evts.filter((e) => isThisWeekend(e.dateTime));
    if (categoryFilter && CATEGORY_MAP[categoryFilter]) {
      evts = evts.filter((e) =>
        CATEGORY_MAP[categoryFilter!].includes(e.communityId),
      );
    }

    evts.sort((a, b) => {
      const aScore = joinedIds.has(a.communityId) ? 0 : 1;
      const bScore = joinedIds.has(b.communityId) ? 0 : 1;
      if (aScore !== bScore) return aScore - bScore;
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });

    return evts;
  }, [state.events, weekendActive, categoryFilter, joinedIds]);

  const handleFilterClick = (label: string) => {
    if (label === "This weekend") {
      setWeekendActive((prev) => !prev);
    } else {
      setCategoryFilter((prev) => (prev === label ? null : label));
    }
  };

  const user = state.currentUser;
  const isFullExpanded = snapPoint === "full" && dragDelta === null;

  // ── Sub-components ──────────────────────────────────────────────────────────

  function FilterChipsRow() {
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-4 scrollbar-none">
        {FILTER_LABELS.map((label) => {
          const active =
            label === "This weekend" ? weekendActive : categoryFilter === label;
          return (
            <PillChip
              key={label}
              label={label}
              active={active}
              onToggle={() => handleFilterClick(label)}
              className="shrink-0"
            />
          );
        })}
      </div>
    );
  }

  function SheetHeader() {
    return (
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gathr-amber">
            Happening
          </p>
          <h2 className="font-display text-lg leading-tight text-gathr-charcoal">
            {weekendActive ? "This weekend" : "All events"} · {user.neighborhood}
          </h2>
        </div>
        <span className="shrink-0 text-sm text-gathr-warm-gray">
          {filteredEvents.length} nearby
        </span>
      </div>
    );
  }

  function EventFeed({ padBottom = true }: { padBottom?: boolean }) {
    return (
      <div className={`h-full overflow-y-auto ${padBottom ? "pb-20" : "pb-6"}`}>
        <motion.div
          className="flex flex-col gap-4 px-4 pt-1"
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
        >
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center text-sm text-gathr-warm-gray">
              No events match these filters.
            </div>
          ) : (
            filteredEvents.map((e) => (
              <motion.div
                key={e.id}
                variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT } }}
              >
                <EventCard
                  id={e.id}
                  name={e.name}
                  location={e.location}
                  dateTime={formatEventDate(e.dateTime)}
                  going={e.totalAttendees}
                  community={e.communityName}
                  soon={e.isSoon}
                  attendees={toAvatarItems(e)}
                  onPress={(id) => {
                    setActiveId(id);
                    navigate({ to: "/event/$eventId", params: { eventId: id } });
                  }}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-gathr-cream-dark">
      {/* ── TopBar (transparent, floats over map) ──────────────────────────── */}
      <div className="absolute inset-x-0 top-0 z-30">
        <TopBar showSearch />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          DESKTOP LAYOUT (lg+)
          Map left 60%, scrollable sidebar right 40%
      ──────────────────────────────────────────────────────────────────────── */}
      {isDesktop ? (
        <div className="flex h-full">
          {/* Map — left 60% */}
          <div className="relative h-full w-[60%]">
            <GoogleMap activeId={activeId} onPinClick={setActiveId} />
            {/* Filter chips floating top-left over map */}
            <div
              className="absolute left-4 z-20 flex items-center gap-2 overflow-x-auto rounded-2xl bg-gathr-cream/80 backdrop-blur-md px-3 py-2 shadow-warm-sm"
              style={{ top: 72 }}
            >
              {FILTER_LABELS.map((label) => {
                const active =
                  label === "This weekend" ? weekendActive : categoryFilter === label;
                return (
                  <PillChip
                    key={label}
                    label={label}
                    active={active}
                    onToggle={() => handleFilterClick(label)}
                    className="shrink-0"
                  />
                );
              })}
            </div>
          </div>

          {/* Sidebar — right 40% */}
          <div className="flex h-full w-[40%] flex-col border-l border-gathr-warm-gray-light/40 bg-gathr-cream pt-16">
            <SheetHeader />
            <div className="flex-1 overflow-hidden">
              <EventFeed padBottom={false} />
            </div>
          </div>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────────────
            MOBILE LAYOUT
            Map fills screen, filter chips float below TopBar,
            draggable bottom sheet overlays the bottom portion
        ─────────────────────────────────────────────────────────────────── */
        <>
          {/* Map — fills full screen beneath everything */}
          <div className="absolute inset-0 z-0">
            <GoogleMap activeId={activeId} onPinClick={setActiveId} />
          </div>

          {/* Neighborhood label — fades in when sheet is fully expanded */}
          <AnimatePresence>
            {isFullExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-gathr-cream/90 px-4 py-1.5 text-sm font-semibold text-gathr-charcoal shadow-warm-sm backdrop-blur-sm"
                style={{ top: 62 }}
              >
                {user.neighborhood}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter chips — frosted glass bar, 16px below TopBar (56px tall) */}
          <div
            className="absolute inset-x-0 z-20 mx-4 overflow-hidden rounded-2xl bg-gathr-cream/80 backdrop-blur-md shadow-warm-sm"
            style={{ top: 72 }}
          >
            <FilterChipsRow />
          </div>

          {/* ── Draggable bottom sheet ─────────────────────────────────────── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 flex flex-col overflow-hidden rounded-t-3xl bg-gathr-cream shadow-warm-lg"
            animate={{ height: sheetHeight }}
            transition={
              dragDelta !== null
                ? { duration: 0 }
                : { type: "spring", stiffness: 350, damping: 42, mass: 1 }
            }
          >
            {/* Handle bar */}
            <div
              className="flex shrink-0 touch-none select-none cursor-grab justify-center pb-1 pt-2 active:cursor-grabbing"
              {...dragHandlers}
            >
              <div className="h-1 w-9 rounded-full bg-gathr-warm-gray-light" />
            </div>

            {/* Sheet header — also draggable */}
            <div
              className="shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
              {...dragHandlers}
            >
              <SheetHeader />
            </div>

            {/* Event feed */}
            <div className="flex-1 overflow-hidden">
              <EventFeed padBottom />
            </div>
          </motion.div>
        </>
      )}

      {/* ── First-time welcome overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: "rgba(44,44,44,0.40)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismissWelcome}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-gathr-cream p-6 shadow-warm-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-xl text-gathr-charcoal">
                Welcome to Gathr, {user.firstName}
              </h2>
              <p className="mt-1 text-base text-gathr-warm-gray">
                Here are a few things happening near you this weekend
              </p>

              {/* Compact event previews */}
              <div className="mt-5 flex flex-col gap-3">
                {filteredEvents.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 rounded-2xl bg-gathr-cream-dark p-3"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gathr-amber/15">
                      <div className="h-2.5 w-2.5 rounded-full bg-gathr-amber" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gathr-charcoal leading-tight">
                        {e.name}
                      </p>
                      <p className="text-xs text-gathr-warm-gray mt-0.5">
                        {formatEventDate(e.dateTime)} · {e.totalAttendees} going
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={dismissWelcome}
                whileTap={{ scale: 0.98 }}
                transition={TRANSITION_SPRING}
                aria-label="Dismiss welcome"
                className="mt-6 w-full rounded-full border border-gathr-warm-gray-light py-3 text-sm font-semibold text-gathr-charcoal transition-colors hover:bg-gathr-cream-dark"
              >
                Got it, let me explore
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
