import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Users, MapPin } from "lucide-react";
import { EVENTS } from "@/lib/gather-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gathr — Find your people this weekend" },
      {
        name: "description",
        content:
          "Gathr connects people through real-world activities and local events. Say what you're doing this weekend — we'll find the right few people nearby.",
      },
      { property: "og:title", content: "Gathr — Find your people this weekend" },
      {
        property: "og:description",
        content:
          "A local community app for people who want to do more on weekends. Activity first, community second.",
      },
    ],
  }),
  component: Landing,
});

const tickerStatements = [
  `${EVENTS[0].totalAttendees} people in Minneapolis are heading to the Vikings game this Sunday`,
  `${EVENTS[1].totalAttendees} people are hitting the trails at Lebanon Hills this Saturday`,
  `${EVENTS[2].totalAttendees} families are meeting at Como Park for coffee this weekend`,
  `${EVENTS[3]?.totalAttendees ?? 19} people are gathering for trivia night at Surly this Friday`,
];

const valueBlocks = [
  {
    icon: MessageCircle,
    headline: "Say what you're up to",
    body: "Tell us what you're doing this weekend — watching the game, hitting a trail, taking the kids somewhere new.",
  },
  {
    icon: Users,
    headline: "We'll find your people",
    body: "Get matched with a small group who's doing the same thing nearby. Not thousands of strangers — just the right few.",
  },
  {
    icon: MapPin,
    headline: "Show up and have fun",
    body: "Meet at the event, have a great time, and connect with people you'd actually want to hang out with again.",
  },
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
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0 }}
            className="flex items-center justify-center"
          >
            <img src="/gathr-logo.png" alt="Gathr" className="h-24 w-auto md:h-40" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="font-body text-xl font-normal text-gathr-charcoal"
          >
            Find your people this weekend.
          </motion.p>

          {/* Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="h-6 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={tickerIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="text-base italic text-gathr-warm-gray"
              >
                {tickerStatements[tickerIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
            className="mt-3 flex flex-col items-center gap-3"
          >
            <Link
              to="/onboarding"
              className="w-full rounded-full bg-gathr-amber px-8 py-4 text-base font-semibold text-white shadow-warm hover:brightness-105 md:w-auto"
            >
              See what's happening
            </Link>
            <p className="text-sm text-gathr-warm-gray">
              Free to join. Takes 60 seconds.
            </p>
            <Link
              to="/app"
              className="text-sm text-gathr-warm-gray underline-offset-2 hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Value Section ─────────────────────────────────── */}
      <section className="bg-gathr-cream-dark py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-3 md:gap-8">
          {valueBlocks.map((block, i) => (
            <motion.div
              key={block.headline}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
            >
              <block.icon className="h-8 w-8 text-gathr-amber" strokeWidth={1.5} />
              <h2 className="font-serif text-lg text-gathr-charcoal">{block.headline}</h2>
              <p className="text-base text-gathr-warm-gray">{block.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-gathr-charcoal px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <span className="font-serif text-lg text-gathr-warm-gray">Gathr</span>
          <nav className="flex gap-6 text-sm text-gathr-warm-gray">
            <a href="#" className="hover:text-gathr-cream-dark transition-colors">About</a>
            <a href="#" className="hover:text-gathr-cream-dark transition-colors">Privacy</a>
            <a href="#" className="hover:text-gathr-cream-dark transition-colors">Terms</a>
          </nav>
          <p className="w-full text-sm text-gathr-warm-gray md:w-auto">
            © {new Date().getFullYear()} Gathr. Twin Cities, MN.
          </p>
        </div>
      </footer>
    </main>
  );
}
