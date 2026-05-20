import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, MapPin, MessageCircle, Share2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { EVENTS, AVATAR_PALETTE } from "@/lib/gather-data";

export const Route = createFileRoute("/event/$eventId")({
  component: EventDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-serif text-2xl">Event not found</h1>
        <Link to="/app" className="mt-3 inline-block text-primary underline">
          Back to the map
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-muted-foreground">{error.message}</div>
  ),
  loader: ({ params }) => {
    const event = EVENTS.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
});

function EventDetail() {
  const { event } = Route.useLoaderData();
  const [going, setGoing] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <TopBar back="/app" />

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Hero */}
        <div className="relative h-48 overflow-hidden topo-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-coral/30 to-forest/40" />
          <div className="relative flex h-full items-end p-5">
            <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-forest shadow-warm-sm">
              {event.community}
            </span>
          </div>
        </div>

        <div className="px-5 pt-5">
          <h1 className="font-serif text-3xl text-ink">{event.name}</h1>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" /> {event.when}
            </p>
            <p className="flex items-start gap-2 text-foreground">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
              <span>
                {event.location}
                <span className="block text-xs text-muted-foreground">{event.address}</span>
              </span>
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-card p-4 shadow-warm-sm ring-1 ring-border/60">
            <div className="flex items-center gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${AVATAR_PALETTE[2]}`}>
                {event.host.initials}
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Hosted by</p>
                <p className="font-medium text-foreground">{event.host.name}</p>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground">
              {event.description}
            </p>
          </div>

          {/* Who's going */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg text-ink">Who's going</h2>
              <span className="text-xs text-muted-foreground">{event.going} people</span>
            </div>

            {going && (
              <div className="mt-3 rounded-2xl bg-sage/10 p-4 ring-1 ring-sage/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                  Your group
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {event.avatars.slice(0, 4).map((a, i) => (
                      <span
                        key={i}
                        className={`grid h-9 w-9 place-items-center rounded-full text-xs font-semibold ring-2 ring-background ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-foreground">
                    You'll meet 4 people from the group.
                  </p>
                </div>
                <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  <MessageCircle className="h-3 w-3" /> Chat with your group
                </button>
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {event.avatars.map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full text-xs font-semibold ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}
                  >
                    {a}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{a}</span>
                </div>
              ))}
              {event.going > event.avatars.length && (
                <div className="flex flex-col items-center gap-1">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    +{event.going - event.avatars.length}
                  </span>
                  <span className="text-[10px] text-muted-foreground">more</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="absolute inset-x-0 bottom-0 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-2">
          <button
            onClick={() => setGoing((g) => !g)}
            className={`flex-1 rounded-full px-5 py-3.5 text-sm font-semibold transition ${
              going
                ? "bg-sage/15 text-forest ring-1 ring-sage/40"
                : "bg-primary text-primary-foreground shadow-warm hover:brightness-105"
            }`}
          >
            {going ? "You're going ✓" : "Count me in"}
          </button>
          <button className="grid h-12 w-12 place-items-center rounded-full bg-muted text-foreground hover:bg-accent">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
