import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MessageCircle, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { MapCanvas } from "@/components/MapCanvas";
import { PhonePreview } from "@/components/PhonePreview";
import { EventCard, type EventCardData } from "@/components/EventCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gather — Find your people this weekend" },
      {
        name: "description",
        content:
          "Gather connects people through real-world activities and local events. Say what you're doing, we'll match you with people doing the same thing nearby.",
      },
      { property: "og:title", content: "Gather — Find your people this weekend" },
      {
        property: "og:description",
        content:
          "A local community app for people who want to do more on weekends. Activity first, community second.",
      },
    ],
  }),
  component: Landing,
});

const sampleEvents: EventCardData[] = [
  {
    id: "1",
    name: "Vikings vs Packers tailgate",
    location: "US Bank Stadium · Lot C",
    when: "Sun · 1:00pm",
    going: 47,
    community: "Vikings Fans",
    avatars: ["JM", "SA", "RT", "KP"],
    live: true,
  },
  {
    id: "2",
    name: "Saturday morning trail run",
    location: "Lebanon Hills · Eagan",
    when: "Sat · 8:00am",
    going: 12,
    community: "Outdoor & Trails",
    avatars: ["EB", "NL", "TC"],
  },
  {
    id: "3",
    name: "Kids + coffee at the park",
    location: "Como Regional Park",
    when: "Sat · 10:00am",
    going: 8,
    community: "Family Adventures",
    avatars: ["MR", "DH", "AS"],
  },
];

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <span className="font-serif text-xl text-forest">Gather</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#communities" className="hover:text-foreground">Communities</a>
            <a href="#weekend" className="hover:text-foreground">This weekend</a>
          </nav>
          <Link
            to="/app"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm-sm hover:brightness-105"
          >
            Open app
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden topo-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div>
            <motion.span
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-warm-sm ring-1 ring-border/60"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse-warm" />
              47 people in Minneapolis are going to the Vikings game Sunday
            </motion.span>
            <motion.h1
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-5 font-serif text-5xl leading-[1.05] text-ink md:text-6xl lg:text-7xl"
            >
              Find your people
              <br />
              <span className="text-primary">this weekend.</span>
            </motion.h1>
            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-5 max-w-lg text-lg text-muted-foreground"
            >
              Gather is a local app that connects people through what they're actually doing —
              not feeds, not followers, not swipes. Say what you're up to. We'll find the
              folks doing it too.
            </motion.p>
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/onboarding"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-warm hover:brightness-105"
              >
                See what's happening near you
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <span className="text-sm text-muted-foreground">Takes about a minute.</span>
            </motion.div>
          </div>

          {/* Hero map */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 22 }}
            className="relative"
          >
            <div className="rounded-3xl bg-card p-3 shadow-warm-lg ring-1 ring-border/60">
              <MapCanvas className="h-[380px] w-full rounded-2xl" showLabels />
              <div className="flex items-center justify-between px-2 pt-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Twin Cities · this weekend
                </p>
                <p className="text-xs font-semibold text-forest">28 events live</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/60 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-2 font-serif text-4xl text-ink md:text-5xl">
              Three steps. No swiping.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: "Say what you're doing",
                body: "Tell us in your own words — watching the Vikes, hiking with the kids, trying a new ramen spot.",
              },
              {
                icon: MapPin,
                title: "Find people doing it too",
                body: "See real activity on a real map. Who's going, what's happening, where to show up.",
              },
              {
                icon: Sparkles,
                title: "Show up and have fun",
                body: "Count yourself in, meet your group, and let the weekend take care of itself.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-card p-7 shadow-warm-sm ring-1 ring-border/60"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-2xl text-ink">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phone preview + this weekend */}
      <section id="weekend" className="border-t border-border/60">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:grid-cols-[1fr_1.15fr]">
          <div className="order-2 md:order-1">
            <PhonePreview />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              This weekend · Twin Cities
            </p>
            <h2 className="mt-2 font-serif text-4xl text-ink md:text-5xl">
              A neighborhood bulletin board, in your pocket.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              The map glows where people are gathering. Tap a pin, see who's going, and
              count yourself in. Small groups form automatically so you actually meet folks
              when you show up.
            </p>
            <div className="mt-8 space-y-3">
              {sampleEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Communities */}
      <section id="communities" className="border-t border-border/60 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Starter communities
              </p>
              <h2 className="mt-2 font-serif text-4xl text-ink md:text-5xl">
                Real groups, real activity.
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Twin Cities, MN · expanding soon
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Vikings Fans", members: 1284, active: "12 events this weekend", color: "bg-primary" },
              { name: "Twins Fans", members: 942, active: "Game night Friday", color: "bg-coral" },
              { name: "Wild Hockey", members: 612, active: "New thread today", color: "bg-forest" },
              { name: "Family Adventures", members: 388, active: "4 playdates this week", color: "bg-sage" },
              { name: "Outdoor & Trails", members: 521, active: "Trail run Saturday", color: "bg-secondary" },
              { name: "Weekend Pickup Sports", members: 264, active: "Soccer at 6pm", color: "bg-primary" },
            ].map((c) => (
              <div
                key={c.name}
                className="flex items-stretch overflow-hidden rounded-2xl bg-card shadow-warm-sm ring-1 ring-border/60"
              >
                <span className={`w-1.5 shrink-0 ${c.color}`} />
                <div className="flex-1 p-5">
                  <h3 className="font-serif text-xl text-ink">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.members} members</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-sage" /> {c.active}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <h2 className="font-serif text-4xl text-ink md:text-6xl">
            Your weekend's already started.
            <br />
            <span className="text-primary">Come find your people.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Free to join. No feeds. No followers. Just real people in your neighborhood
            doing the things you already like to do.
          </p>
          <Link
            to="/onboarding"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-warm hover:brightness-105"
          >
            See what's happening near you
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
              <MapPin className="h-3 w-3" />
            </span>
            <span className="font-serif text-base text-forest">Gather</span>
            <span className="ml-3">Made in the Twin Cities</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
