import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Users } from "lucide-react";

export type EventCardData = {
  id: string;
  name: string;
  location: string;
  when: string;
  going: number;
  community: string;
  avatars?: string[]; // initials
  live?: boolean;
};

const avatarPalette = [
  "bg-primary/80 text-primary-foreground",
  "bg-sage/80 text-white",
  "bg-coral/80 text-white",
  "bg-forest/80 text-white",
  "bg-accent text-accent-foreground",
];

export function EventCard({ event }: { event: EventCardData }) {
  const [going, setGoing] = useState(false);

  return (
    <motion.article
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="rounded-2xl bg-card p-5 shadow-warm-sm ring-1 ring-border/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {event.live && (
              <span className="inline-flex items-center gap-1 rounded-full bg-coral/15 px-2 py-0.5 text-[11px] font-semibold text-coral">
                <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse-warm" />
                Happening soon
              </span>
            )}
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {event.community}
            </span>
          </div>
          <h3 className="mt-2 font-serif text-xl text-foreground">{event.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {event.location}
            </span>
            <span>{event.when}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {(event.avatars ?? ["JM", "SA", "RT", "KP"]).slice(0, 4).map((a, i) => (
              <span
                key={i}
                className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold ring-2 ring-card ${avatarPalette[i % avatarPalette.length]}`}
              >
                {a}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> {event.going} going
          </span>
        </div>

        <button
          onClick={() => setGoing((v) => !v)}
          className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition ${
            going
              ? "bg-sage/15 text-forest ring-1 ring-sage/40"
              : "bg-primary text-primary-foreground shadow-warm-sm hover:brightness-105"
          }`}
        >
          {going ? "You're going ✓" : "Count me in"}
        </button>
      </div>
    </motion.article>
  );
}
