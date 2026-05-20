import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { GoogleMap } from "@/components/GoogleMap";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { EVENTS, AVATAR_PALETTE } from "@/lib/gather-data";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Gather — Happening near you" }] }),
  component: AppScreen,
});

function AppScreen() {
  const [activeId, setActiveId] = useState<string>("vikes");
  const [going, setGoing] = useState<Record<string, boolean>>({});

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <TopBar showSearch />

      {/* Map — top 50% */}
      <div className="relative h-1/2 w-full">
        <GoogleMap activeId={activeId} onPinClick={setActiveId} />
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center gap-2 px-4">
          <div className="pointer-events-auto flex gap-2 overflow-x-auto rounded-full bg-background/90 px-1 py-1 shadow-warm ring-1 ring-border/60 backdrop-blur">
            {["This weekend", "Family", "Free", "Sports", "Outdoors"].map((f, i) => (
              <button
                key={f}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  i === 0
                    ? "bg-primary text-primary-foreground shadow-warm-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="relative flex-1 overflow-hidden bg-paper">
        <div className="flex justify-center pt-2 pb-1">
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>
        <div className="flex items-center justify-between px-5 pb-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Happening
            </p>
            <h2 className="font-serif text-lg text-ink">This weekend · Eagan</h2>
          </div>
          <span className="text-xs text-muted-foreground">{EVENTS.length} nearby</span>
        </div>

        <div className="h-[calc(100%-72px)] overflow-y-auto px-4 pb-4">
          <div className="space-y-3">
            {EVENTS.map((e) => {
              const isActive = e.id === activeId;
              const isGoing = going[e.id];
              return (
                <motion.div
                  key={e.id}
                  layout
                  onMouseEnter={() => setActiveId(e.id)}
                  className={`w-full rounded-2xl bg-card p-4 text-left shadow-warm-sm ring-1 transition ${
                    isActive ? "ring-primary/60" : "ring-border/60 hover:ring-border"
                  }`}
                >
                  <Link
                    to="/event/$eventId"
                    params={{ eventId: e.id }}
                    onClick={() => setActiveId(e.id)}
                    className="block"
                  >
                    <div className="flex items-center gap-2">
                      {e.live && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-coral/15 px-2 py-0.5 text-[10px] font-semibold text-coral">
                          <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse-warm" />
                          Soon
                        </span>
                      )}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {e.community}
                      </span>
                      <span className="ml-auto text-[11px] text-muted-foreground">{e.when}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-base text-foreground">{e.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {e.location}
                    </p>
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {e.avatars.slice(0, 4).map((a, i) => (
                          <span
                            key={i}
                            className={`grid h-6 w-6 place-items-center rounded-full text-[9px] font-semibold ring-2 ring-card ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{e.going} going</span>
                    </div>
                    <button
                      onClick={() => setGoing((g) => ({ ...g, [e.id]: !g[e.id] }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        isGoing
                          ? "bg-sage/15 text-forest ring-1 ring-sage/40"
                          : "bg-primary text-primary-foreground shadow-warm-sm hover:brightness-105"
                      }`}
                    >
                      {isGoing ? "You're going ✓" : "Count me in"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
