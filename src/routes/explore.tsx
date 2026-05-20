import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { COMMUNITIES } from "@/lib/gather-data";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Gather — Explore" }] }),
  component: ExploreScreen,
});

const CATEGORIES = ["Sports", "Family", "Outdoors", "Food & Drink", "Fitness", "Arts & Culture"];

function ExploreScreen() {
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <TopBar />
      <main className="flex-1 overflow-y-auto bg-paper pb-6">
        <div className="px-5 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Explore
          </p>
          <h1 className="font-serif text-2xl text-ink">Find your next thing.</h1>

          <div className="mt-4 flex items-center gap-2 rounded-full bg-card px-4 py-3 shadow-warm-sm ring-1 ring-border/60">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Try 'pickup soccer' or 'live music'"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
            {CATEGORIES.map((c, i) => (
              <button
                key={c}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  i === 0
                    ? "bg-forest text-primary-foreground"
                    : "bg-card text-muted-foreground ring-1 ring-border/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Trending */}
        <section className="mt-6 px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-coral">
            Trending near you
          </p>
          <div className="mt-2 space-y-2">
            {COMMUNITIES.slice(0, 2).map((c) => (
              <Link
                key={c.id}
                to="/community/$communityId"
                params={{ communityId: c.id }}
                className="block rounded-2xl bg-card p-4 shadow-warm-sm ring-1 ring-border/60 hover:ring-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-base text-foreground">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.members} members · {c.activity}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    Join
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All */}
        <section className="mt-8 px-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            All communities · Twin Cities
          </p>
          <div className="mt-3 space-y-3">
            {COMMUNITIES.map((c) => (
              <div
                key={c.id}
                className="flex items-stretch overflow-hidden rounded-2xl bg-card shadow-warm-sm ring-1 ring-border/60"
              >
                <span className={`w-1.5 shrink-0 ${c.color}`} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to="/community/$communityId"
                        params={{ communityId: c.id }}
                        className="font-serif text-base text-foreground hover:text-primary"
                      >
                        {c.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {c.members} members · {c.activity}
                      </p>
                    </div>
                    <button className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
