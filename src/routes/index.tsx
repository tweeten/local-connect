import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Target, Users, CalendarCheck, Flag, Mountain, Bike } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gathr — Stop scrolling. Start playing." },
      {
        name: "description",
        content:
          "We match you with a small group of people who share your hobby, skill level, and goals — so you always have someone to play with.",
      },
      { property: "og:title", content: "Gathr — Stop scrolling. Start playing." },
      {
        property: "og:description",
        content:
          "We match you with a small group of people who share your hobby, skill level, and goals — so you always have someone to play with.",
      },
    ],
  }),
  component: Landing,
});

const tickerStatements = [
  "4 groups are teeing off this Saturday",
  "12 players matched this week",
  "Avg group plays together 2.3x per week",
];

const howItWorksBlocks = [
  {
    icon: Target,
    headline: "Tell us your game",
    body: "Your score, how often you play, and what you're working toward. We call that your Third Object.",
  },
  {
    icon: Users,
    headline: "We find your people",
    body: "Our matching engine pairs you with 3-4 players at your level, near you, with similar goals.",
  },
  {
    icon: CalendarCheck,
    headline: "Show up and play",
    body: "Your group gets a private space to coordinate tee times, share tips, and track progress together.",
  },
];

const activities = [
  { label: "Golf", icon: Flag, active: true },
  { label: "Trail Running", icon: Mountain, active: false },
  { label: "Pickup Basketball", icon: null, active: false },
  { label: "Tennis", icon: null, active: false },
  { label: "Cycling", icon: Bike, active: false },
  { label: "Climbing", icon: Mountain, active: false },
];

function Landing() {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTickerIndex((i) => (i + 1) % tickerStatements.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-gathr-cream text-gathr-charcoal">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, oklch(0.50 0.12 155 / 0.18) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 80% 70%, oklch(0.50 0.12 155 / 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 50% 50%, oklch(0.50 0.12 155 / 0.08) 0%, transparent 100%),
            var(--color-gathr-cream)
          `,
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "300px 300px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0 }}
            className="flex items-center justify-center"
          >
            <img src="/gathr-logo.png" alt="Gathr" className="h-24 w-auto md:h-40" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="font-display text-4xl text-gathr-charcoal md:text-5xl"
          >
            Stop scrolling. Start playing.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="font-body max-w-md text-xl text-gathr-warm-gray"
          >
            We match you with 3-4 people at your level who want to play as often as you do.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="mt-3 flex flex-col items-center gap-3"
          >
            <Link
              to="/onboarding"
              className="inline-flex h-14 items-center justify-center rounded-full bg-gathr-forest px-8 text-lg font-semibold text-white shadow-warm transition-colors hover:bg-gathr-forest-light"
            >
              Find your foursome
            </Link>
            <Link
              to="/home"
              className="text-sm text-gathr-warm-gray underline-offset-2 hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="bg-gathr-cream-dark py-24">
        <div className="mx-auto max-w-5xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-display mb-16 text-center text-2xl text-gathr-charcoal md:text-3xl"
          >
            How it works
          </motion.h2>
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {howItWorksBlocks.map((block, i) => (
              <motion.div
                key={block.headline}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
              >
                <block.icon className="h-8 w-8 text-gathr-forest" strokeWidth={1.5} />
                <h3 className="font-serif text-lg text-gathr-charcoal">{block.headline}</h3>
                <p className="text-base text-gathr-warm-gray">{block.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof Ticker ────────────────────────────── */}
      <section className="bg-gathr-cream py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-body text-sm font-semibold uppercase tracking-widest text-gathr-forest"
          >
            Right now in the Twin Cities
          </motion.p>
          <div className="h-7 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={tickerIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="font-body text-lg italic text-gathr-warm-gray"
              >
                {tickerStatements[tickerIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Activity Preview ───────────────────────────────── */}
      <section className="bg-gathr-cream-dark py-24">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display mb-3 text-2xl text-gathr-charcoal md:text-3xl">
              Starting with golf. Expanding to everything.
            </h2>
            <p className="font-body text-base text-gathr-warm-gray">
              Golf is our first activity. Trail running, pickup basketball, and more are coming.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className={`relative flex flex-col items-center gap-2 rounded-card-lg p-4 text-center shadow-warm-sm ${
                  activity.active
                    ? "bg-gathr-forest text-white"
                    : "bg-gathr-cream text-gathr-warm-gray-light"
                }`}
              >
                {activity.icon ? (
                  <activity.icon className="h-6 w-6" strokeWidth={1.5} />
                ) : (
                  <span className="h-6 w-6 flex items-center justify-center text-base leading-none">
                    {activity.label === "Pickup Basketball" ? "🏀" : "🎾"}
                  </span>
                )}
                <span className={`font-body text-xs font-semibold ${activity.active ? "text-white" : "text-gathr-warm-gray-light"}`}>
                  {activity.label}
                </span>
                {!activity.active && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gathr-cream-dark px-2 py-0.5 text-[10px] font-semibold text-gathr-warm-gray whitespace-nowrap">
                    Coming soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-gathr-charcoal px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <span className="font-serif text-lg text-gathr-warm-gray">Gathr</span>
          <nav className="flex gap-6 text-sm text-gathr-warm-gray">
            <a href="#" className="transition-colors hover:text-gathr-cream-dark">About</a>
            <a href="#" className="transition-colors hover:text-gathr-cream-dark">Privacy</a>
            <a href="#" className="transition-colors hover:text-gathr-cream-dark">Terms</a>
          </nav>
          <p className="w-full text-sm text-gathr-warm-gray md:w-auto">
            © {new Date().getFullYear()} Gathr. Twin Cities, MN.
          </p>
        </div>
      </footer>
    </main>
  );
}
