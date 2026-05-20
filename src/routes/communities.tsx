import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { COMMUNITIES } from "@/lib/gather-data";

export const Route = createFileRoute("/communities")({
  head: () => ({ meta: [{ title: "Gather — Your communities" }] }),
  component: CommunitiesScreen,
});

function CommunitiesScreen() {
  const joined = COMMUNITIES.slice(0, 5);
  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <TopBar />
      <main className="flex-1 overflow-y-auto bg-paper">
        <div className="px-5 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            Your communities
          </p>
          <div className="mt-1 flex items-end justify-between">
            <h1 className="font-serif text-2xl text-ink">5 groups, lots happening.</h1>
            <Link to="/explore" className="text-sm font-medium text-forest hover:underline">
              + Explore more
            </Link>
          </div>
        </div>

        <div className="mt-5 space-y-3 px-4 pb-6">
          {joined.map((c) => (
            <Link
              key={c.id}
              to="/community/$communityId"
              params={{ communityId: c.id }}
              className="flex items-stretch overflow-hidden rounded-2xl bg-card shadow-warm-sm ring-1 ring-border/60 transition hover:ring-primary/40"
            >
              <span className={`w-1.5 shrink-0 ${c.color}`} />
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-ink">{c.name}</h3>
                  <span className="text-xs text-muted-foreground">{c.members} members</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage" /> {c.activity}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mx-5 mb-8 rounded-2xl border border-dashed border-border bg-card/50 p-5 text-center">
          <p className="font-serif text-lg text-ink">Looking for something new?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            There are 14 more communities in the Twin Cities.
          </p>
          <Link
            to="/explore"
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Explore communities
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
