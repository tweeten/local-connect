import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUp, MapPin, Plus, Sparkles } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { COMMUNITIES, EVENTS, AVATAR_PALETTE } from "@/lib/gather-data";

export const Route = createFileRoute("/community/$communityId")({
  component: CommunityDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-serif text-2xl">Community not found</h1>
        <Link to="/communities" className="mt-3 inline-block text-primary underline">
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

type Tab = "conversations" | "events" | "recs";

const THREADS = [
  {
    id: "t1",
    title: "Best parking spot for Sunday?",
    by: "Sam A.",
    initials: "SA",
    replies: 14,
    when: "2h ago",
  },
  {
    id: "t2",
    title: "Anyone wanna split a brisket order from Animales?",
    by: "Ben L.",
    initials: "BL",
    replies: 7,
    when: "5h ago",
  },
  {
    id: "t3",
    title: "Skol chant practice for the new folks",
    by: "Jordan M.",
    initials: "JM",
    replies: 23,
    when: "Yesterday",
  },
];

const RECS = [
  {
    id: "r1",
    by: "Sarah",
    initials: "SA",
    text: "Parking at Lot C is half the price and only a 5 min walk to the stadium.",
    tag: "Tip",
    upvotes: 23,
  },
  {
    id: "r2",
    by: "Marcus",
    initials: "MR",
    text: "Brit's Pub patio before the game is criminally underrated.",
    tag: "Places",
    upvotes: 14,
  },
  {
    id: "r3",
    by: "Erin",
    initials: "EB",
    text: "Hand warmers from the Holiday at Park Ave save lives in November.",
    tag: "Gear",
    upvotes: 9,
  },
];

function CommunityDetail() {
  const { community } = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("conversations");
  const events = EVENTS.filter((e) => e.communityId === community.id);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <TopBar back="/communities" title={community.name} />

      {/* Banner */}
      <div className="relative h-32 overflow-hidden topo-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-coral/70" />
        <div className="relative flex h-full items-end justify-between p-5">
          <div className="text-primary-foreground">
            <p className="font-serif text-2xl">{community.name}</p>
            <p className="text-xs opacity-90">
              {community.members} members · {community.region}
            </p>
          </div>
          <button className="rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-forest shadow-warm-sm">
            Joined ✓
          </button>
        </div>
      </div>

      <p className="px-5 pt-3 text-sm text-muted-foreground">{community.description}</p>

      {/* Tabs */}
      <div className="flex gap-2 px-4 py-3">
        {(["conversations", "events", "recs"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              tab === t
                ? "bg-primary text-primary-foreground shadow-warm-sm"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto bg-paper px-4 pb-6">
        {tab === "conversations" && (
          <div className="space-y-3 pt-2">
            <div className="rounded-2xl bg-card p-4 ring-1 ring-border/60">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">What's everyone doing this weekend?</span>{" "}
                  — start the thread
                </p>
              </div>
            </div>
            {THREADS.map((t) => (
              <button
                key={t.id}
                className="w-full rounded-2xl bg-card p-4 text-left shadow-warm-sm ring-1 ring-border/60 hover:ring-primary/40"
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${AVATAR_PALETTE[0]}`}>
                    {t.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base text-foreground">{t.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.by} · {t.replies} replies · {t.when}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === "events" && (
          <div className="space-y-3 pt-2">
            <Link
              to="/create"
              className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-dashed ring-border hover:ring-primary/40"
            >
              <span className="text-sm font-medium text-foreground">Start something this week</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                <Plus className="h-3 w-3" /> Create
              </span>
            </Link>
            {events.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing scheduled yet. Be the first to start something.
              </p>
            ) : (
              events.map((e) => (
                <Link
                  key={e.id}
                  to="/event/$eventId"
                  params={{ eventId: e.id }}
                  className="block rounded-2xl bg-card p-4 shadow-warm-sm ring-1 ring-border/60 hover:ring-primary/40"
                >
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{e.when}</span>
                    <span>{e.going} going</span>
                  </div>
                  <p className="mt-1 font-serif text-base text-foreground">{e.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {e.location}
                  </p>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === "recs" && (
          <div className="space-y-3 pt-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All", "Places", "Tips", "Gear", "Food & drink"].map((c, i) => (
                <button
                  key={c}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                    i === 0
                      ? "bg-forest text-primary-foreground"
                      : "bg-card text-muted-foreground ring-1 ring-border/60"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {RECS.map((r, i) => (
              <div
                key={r.id}
                className="rounded-2xl bg-card p-4 shadow-warm-sm ring-1 ring-border/60"
              >
                <div className="flex items-start gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}>
                    {r.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{r.by}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {r.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{r.text}</p>
                    <button className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-forest hover:text-primary">
                      <ArrowUp className="h-3 w-3" /> {r.upvotes} useful
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
