import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar,
  MapPin,
  Share2,
  Check,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import {
  TopBar,
  GathrAvatar,
  AvatarGroup,
  SectionHeader,
  PillChip,
} from "@/components/ui";
import {
  EVENTS,
  COMMUNITIES,
  getUserInitials,
  formatEventDate,
} from "@/lib/gather-data";
import { useGathr } from "@/lib/GathrContext";
import { TRANSITION_SPRING, STAGGER_CHILDREN } from "@/lib/design-tokens";

export const Route = createFileRoute("/_app/event/$eventId")({
  component: EventDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl">Event not found</h1>
        <Link to="/app" className="mt-3 inline-block text-primary underline">
          Back to the map
        </Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="p-6 text-sm text-gathr-warm-gray">
      Something went wrong loading this event. Head back and try again.
    </div>
  ),
  loader: ({ params }) => {
    const event = EVENTS.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
});

// Gradient per community accent color
const HERO_GRADIENT: Record<string, string> = {
  amber: "from-gathr-amber/80 to-gathr-amber/40",
  sage: "from-gathr-sage/80 to-gathr-sage/40",
  coral: "from-gathr-coral/80 to-gathr-coral/40",
  terracotta: "from-gathr-terracotta/80 to-gathr-terracotta/40",
  "dusty-blue": "from-gathr-dusty-blue/80 to-gathr-dusty-blue/40",
};

function EventDetail() {
  const { event: loaderEvent } = Route.useLoaderData();
  const { eventId } = Route.useParams();
  const { state, toggleAttendance } = useGathr();

  const [showAll, setShowAll] = useState(false);
  const [justJoined, setJustJoined] = useState(false);

  // Live state from context so RSVP toggles reflect immediately
  const event = state.events.find((e) => e.id === eventId) ?? loaderEvent;

  const community = COMMUNITIES.find((c) => c.id === event.communityId);
  const accentColor = community?.accentColor ?? "amber";
  const heroGradient =
    HERO_GRADIENT[accentColor] ?? HERO_GRADIENT["amber"];

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`;

  const avatarItems = event.attendees.map((u) => ({
    initials: getUserInitials(u),
    alt: u.firstName,
  }));

  function handleToggle() {
    if (!event.isAttending) {
      setJustJoined(true);
    }
    toggleAttendance(event.id);
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar back="/app" title={event.name} showBell={false} />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pb-40 pt-16 lg:pb-8">
        <div>

          {/* ── Hero location card ── */}
          <div
            className={`relative h-[200px] w-full overflow-hidden bg-gradient-to-br ${heroGradient} rounded-b-[16px]`}
          >
            {/* Warm topo texture overlay */}
            <div className="absolute inset-0 opacity-10 topo-bg" />

            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
              <MapPin className="mb-2 h-7 w-7 text-white/80" strokeWidth={1.75} />
              <p className="font-display text-2xl font-semibold text-white leading-tight">
                {event.location}
              </p>
              <p className="mt-1 text-sm text-white/80">{event.address}</p>
            </div>
          </div>

          {/* ── Event info ── */}
          <div className="px-5 pt-5 space-y-1">
            <h1 className="font-body text-2xl font-semibold text-gathr-charcoal leading-tight">
              {event.name}
            </h1>

            {/* Date */}
            <div className="flex items-center gap-2 pt-1">
              <Calendar className="h-4 w-4 shrink-0 text-gathr-warm-gray" strokeWidth={1.75} />
              <span className="text-base text-gathr-warm-gray">
                {formatEventDate(event.dateTime)}
              </span>
            </div>

            {/* Location — tappable to Google Maps */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-gathr-warm-gray" strokeWidth={1.75} />
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gathr-warm-gray underline-offset-2 hover:underline active:underline"
              >
                {event.location} · {event.address}
              </a>
            </div>

            {/* Community pill */}
            <div className="pt-1">
              <Link
                to="/community/$communityId"
                params={{ communityId: event.communityId }}
              >
                <PillChip
                  label={event.communityName}
                  active={false}
                  className="pointer-events-none"
                />
              </Link>
            </div>
          </div>

          {/* ── Creator line ── */}
          <div className="px-5 pt-4">
            <Link
              to="/profile/$userId"
              params={{ userId: event.host.id }}
              className="inline-flex items-center gap-2 group"
            >
              <span className="text-sm text-gathr-warm-gray">Started by</span>
              <GathrAvatar
                initials={getUserInitials(event.host)}
                size="xs"
              />
              <span className="text-sm font-medium text-gathr-charcoal group-hover:underline underline-offset-2">
                {event.host.firstName}
              </span>
            </Link>
          </div>

          {/* ── Description ── */}
          <div className="px-5 pt-4">
            <p className="text-base text-gathr-charcoal leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* ── Who's going ── */}
          <div className="px-5 pt-6">
            <SectionHeader
              title="Who's going"
              linkLabel={`${event.totalAttendees} people`}
            />

            <AvatarGroup avatars={avatarItems} max={6} size="sm" />

            {/* See everyone expandable */}
            <motion.button
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gathr-amber"
              whileTap={{ scale: 0.98 }}
              transition={TRANSITION_SPRING}
              aria-expanded={showAll}
            >
              {showAll ? "Hide" : "See everyone"}
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
              {showAll && (
                <motion.div
                  key="attendee-grid"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <motion.div
                    className="mt-4 grid grid-cols-3 gap-4"
                    initial="initial"
                    animate="animate"
                    variants={{
                      animate: {
                        transition: { staggerChildren: STAGGER_CHILDREN },
                      },
                    }}
                  >
                    {event.attendees.map((attendee) => (
                      <motion.div
                        key={attendee.id}
                        variants={{
                          initial: { opacity: 0, y: 8 },
                          animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                        }}
                      >
                        <Link
                          to="/profile/$userId"
                          params={{ userId: attendee.id }}
                          className="flex flex-col items-center gap-1.5 group"
                        >
                          <GathrAvatar
                            initials={getUserInitials(attendee)}
                            size="sm"
                          />
                          <span className="text-xs text-gathr-warm-gray group-hover:text-gathr-charcoal transition-colors">
                            {attendee.firstName}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                    {event.totalAttendees > event.attendees.length && (
                      <motion.div
                        variants={{
                          initial: { opacity: 0, y: 8 },
                          animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                        }}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gathr-cream-dark ring-2 ring-gathr-cream text-xs font-semibold text-gathr-warm-gray">
                          +{event.totalAttendees - event.attendees.length}
                        </div>
                        <span className="text-xs text-gathr-warm-gray">more</span>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Post-join group chat card ── */}
          <AnimatePresence>
            {event.isAttending && (
              <motion.div
                key="group-chat"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="mx-5 mt-4"
              >
                <Link to="/messages/$chatId" params={{ chatId: event.id }}>
                  <div className="flex items-center justify-between rounded-[16px] bg-gathr-sage/10 px-4 py-4 ring-1 ring-gathr-sage/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gathr-forest/10">
                        <MessageCircle
                          className="h-5 w-5 text-gathr-forest"
                          strokeWidth={1.75}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gathr-forest">
                          Your group chat
                        </p>
                        <p className="text-sm text-gathr-warm-gray mt-0.5">
                          Chat with your group →
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Desktop inline CTA ── */}
          <div className="hidden lg:block px-5 pt-6 pb-6">
            <DesktopCTA
              isAttending={event.isAttending}
              justJoined={justJoined}
              onToggle={handleToggle}
              googleMapsUrl={googleMapsUrl}
            />
          </div>
        </div>
      </main>

      {/* ── Mobile sticky CTA bar (hidden on desktop) ── */}
      <div className="lg:hidden absolute inset-x-0 bottom-0 bg-background/95 backdrop-blur border-t border-border/60 px-4 py-3 shadow-[0_-2px_12px_rgba(44,44,44,0.06)]">
        <div className="flex items-center gap-2">
          <CTAButton
            isAttending={event.isAttending}
            justJoined={justJoined}
            onToggle={handleToggle}
          />
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gathr-cream-dark text-gathr-warm-gray hover:bg-gathr-cream transition-colors"
            aria-label="Share event"
            onClick={(e) => {
              e.preventDefault();
              if (navigator.share) {
                navigator.share({ title: event.name, url: window.location.href });
              }
            }}
          >
            <Share2 className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── CTA button with scale-pulse on join ─────────────────────────────────────

interface CTAProps {
  isAttending: boolean;
  justJoined: boolean;
  onToggle: () => void;
}

function CTAButton({ isAttending, justJoined, onToggle }: CTAProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`flex-1 flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-colors ${
        isAttending
          ? "bg-gathr-sage/15 text-gathr-forest ring-1 ring-gathr-sage/40"
          : "bg-primary text-primary-foreground shadow-warm hover:brightness-105"
      }`}
      animate={
        justJoined && isAttending
          ? { scale: [1, 1.03, 1] }
          : { scale: 1 }
      }
      transition={{ duration: 0.3, ease: "easeInOut" }}
      whileTap={{ scale: 0.98 }}
    >
      {isAttending ? (
        <>
          <Check className="h-4 w-4" strokeWidth={2.5} />
          You're going
        </>
      ) : (
        "Count me in"
      )}
    </motion.button>
  );
}

// ─── Desktop inline CTA with share button ────────────────────────────────────

interface DesktopCTAProps extends CTAProps {
  googleMapsUrl: string;
}

function DesktopCTA({ isAttending, justJoined, onToggle, googleMapsUrl }: DesktopCTAProps) {
  return (
    <div className="flex items-center gap-2">
      <CTAButton isAttending={isAttending} justJoined={justJoined} onToggle={onToggle} />
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gathr-cream-dark text-gathr-warm-gray hover:bg-gathr-cream transition-colors"
        aria-label="Share event"
      >
        <Share2 className="h-4 w-4" strokeWidth={1.75} />
      </a>
    </div>
  );
}
