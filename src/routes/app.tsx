import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Bell, Compass, MapPin, Users, Search } from "lucide-react";
import { GoogleMap, MAP_PINS } from "@/components/GoogleMap";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: "Gather — Happening near you" }],
  }),
  component: AppScreen,
});

type EventItem = {
  id: string;
  name: string;
  community: string;
  location: string;
  when: string;
  going: number;
  avatars: string[];
  live?: boolean;
};

const EVENTS: EventItem[] = [
  {
    id: "vikes",
    name: "Vikings vs Packers tailgate",
    community: "Vikings Fans",
    location: "US Bank Stadium · Lot C",
    when: "Sun · 1:00pm",
    going: 47,
    avatars: ["JM", "SA", "RT", "KP"],
    live: true,
  },
  {
    id: "trail",
    name: "Saturday trail run",
    community: "Outdoor & Trails",
    location: "Lebanon Hills · Eagan",
    when: "Sat · 8:00am",
    going: 12,
    avatars: ["EB", "NL", "TC"],
  },
  {
    id: "park",
    name: "Kids + coffee at the park",
    community: "Family Adventures",
    location: "Como Regional Park",
    when: "Sat · 10:00am",
    going: 8,
    avatars: ["MR", "DH", "AS"],
  },
  {
    id: "trivia",
    name: "Trivia night @ Surly",
    community: "Food & Drink",
    location: "Surly Brewing · Mpls",
    when: "Thu · 7:00pm",
    going: 19,
    avatars: ["BL", "VK", "JN", "CR"],
  },
  {
    id: "farm",
    name: "Mill City Farmers Market",
    community: "Food & Drink",
    location: "Mill City · Mpls",
    when: "Sat · 9:00am",
    going: 6,
    avatars: ["GH", "PT"],
  },
];

const avatarPalette = [
  "bg-primary/85 text-primary-foreground",
  "bg-sage/85 text-white",
  "bg-coral/85 text-white",
  "bg-forest/85 text-white",
];

function AppScreen() {
  const [activeId, setActiveId] = useState<string>("vikes");
  const [going, setGoing] = useState<Record<string, boolean>>({});

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="font-serif text-xl text-forest">Gather</Link>
        <div className="flex items-center gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-accent">
            <Search className="h-4 w-4" />
          </button>
          <button className="relative grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral ring-2 ring-background" />
          </button>
        </div>
      </header>

      {/* Map — top 50% */}
      <div className="relative h-1/2 w-full">
        <GoogleMap activeId={activeId} onPinClick={setActiveId} />
        {/* Floating filter chips */}
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

      {/* Feed — between map and bottom bar */}
      <div className="relative flex-1 overflow-hidden bg-paper">
        {/* Drag handle */}
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
                <motion.button
                  key={e.id}
                  layout
                  onClick={() => {
                    setActiveId(e.id);
                    const pin = MAP_PINS.find((p) => p.id === e.id);
                    if (pin) window.scrollTo({ top: 0 });
                  }}
                  className={`w-full rounded-2xl bg-card p-4 text-left shadow-warm-sm ring-1 transition ${
                    isActive ? "ring-primary/60" : "ring-border/60 hover:ring-border"
                  }`}
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
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {e.avatars.slice(0, 4).map((a, i) => (
                          <span
                            key={i}
                            className={`grid h-6 w-6 place-items-center rounded-full text-[9px] font-semibold ring-2 ring-card ${avatarPalette[i % avatarPalette.length]}`}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{e.going} going</span>
                    </div>
                    <span
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setGoing((g) => ({ ...g, [e.id]: !g[e.id] }));
                      }}
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        isGoing
                          ? "bg-sage/15 text-forest ring-1 ring-sage/40"
                          : "bg-primary text-primary-foreground shadow-warm-sm"
                      }`}
                    >
                      {isGoing ? "You're going ✓" : "Count me in"}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar — profile photo on bottom left */}
      <nav className="flex items-center justify-between border-t border-border/60 bg-background/95 px-4 py-2.5 backdrop-blur">
        <button className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-coral text-sm font-bold text-primary-foreground shadow-warm-sm ring-2 ring-background">
            AM
          </span>
          <span className="hidden text-sm font-semibold text-foreground sm:inline">Alex</span>
        </button>
        <div className="flex items-center gap-1">
          {[
            { icon: MapPin, label: "Happening", active: true },
            { icon: Users, label: "Communities" },
            { icon: Compass, label: "Explore" },
          ].map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 transition ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
