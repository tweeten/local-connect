import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, MapPin, Pencil, MessageCircle } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { COMMUNITIES, AVATAR_PALETTE } from "@/lib/gather-data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Gather — Your profile" }] }),
  component: ProfileScreen,
});

const HISTORY = [
  { id: "h1", date: "Oct 15", name: "Vikings vs Jets", count: 6 },
  { id: "h2", date: "Oct 12", name: "Lebanon Hills trail run", count: 9 },
  { id: "h3", date: "Oct 8", name: "Trivia @ Surly", count: 5 },
  { id: "h4", date: "Oct 5", name: "Como Park playdate", count: 7 },
];

const CONNECTIONS = ["JM", "SA", "RT", "KP", "EB", "MR", "BL", "GH"];

function ProfileScreen() {
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <TopBar />
      <main className="flex-1 overflow-y-auto bg-paper pb-6">
        <section className="bg-background px-5 pb-6 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary to-coral text-2xl font-bold text-primary-foreground shadow-warm">
                AM
              </span>
              <div>
                <h1 className="font-serif text-2xl text-ink">Alex M.</h1>
                <p className="text-sm text-muted-foreground">Eagan · since Aug 2024</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-coral/15 px-2 py-0.5 text-[11px] font-semibold text-coral">
                  <Flame className="h-3 w-3" /> 4-week streak
                </span>
              </div>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-accent">
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { n: 12, label: "events attended" },
              { n: 3, label: "communities" },
              { n: 8, label: "connections" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-card p-3 text-center ring-1 ring-border/60">
                <p className="font-serif text-2xl text-foreground">{s.n}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming */}
        <section className="mt-2 px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Up next
          </p>
          <Link
            to="/event/$eventId"
            params={{ eventId: "vikes" }}
            className="mt-2 block rounded-2xl bg-card p-4 shadow-warm-sm ring-1 ring-border/60 hover:ring-primary/40"
          >
            <p className="font-serif text-base text-foreground">Vikings vs Packers tailgate</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> US Bank Stadium · Sun 1pm
            </p>
          </Link>
        </section>

        {/* Communities */}
        <section className="mt-6 px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Your communities
          </p>
          <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-2">
            {COMMUNITIES.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to="/community/$communityId"
                params={{ communityId: c.id }}
                className="shrink-0 rounded-2xl bg-card px-4 py-3 ring-1 ring-border/60 hover:ring-primary/40"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${c.color}`} />
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Connections */}
        <section className="mt-6 px-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Connections
            </p>
            <button className="inline-flex items-center gap-1 text-xs font-medium text-forest">
              <MessageCircle className="h-3 w-3" /> Messages
            </button>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-3 sm:grid-cols-8">
            {CONNECTIONS.map((a, i) => (
              <span
                key={i}
                className={`grid h-11 w-11 place-items-center rounded-full text-xs font-semibold ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}
              >
                {a}
              </span>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="mt-8 px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Recent activity
          </p>
          <div className="mt-3 space-y-2">
            {HISTORY.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border/60"
              >
                <div>
                  <p className="text-sm text-foreground">{h.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {h.date} · {h.count} people
                  </p>
                </div>
                <span className="text-[11px] font-medium text-sage">Attended</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
