import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Calendar, MapPin } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { COMMUNITIES } from "@/lib/gather-data";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Gather — Create an event" }] }),
  component: CreateEvent,
});

function CreateEvent() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [communityId, setCommunityId] = useState(COMMUNITIES[0].id);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("open");

  const sizes = [
    { id: "intimate", label: "2–5", help: "Intimate" },
    { id: "small", label: "5–15", help: "Small group" },
    { id: "big", label: "15+", help: "The more the merrier" },
    { id: "open", label: "Open", help: "No limit" },
  ];

  const community = COMMUNITIES.find((c) => c.id === communityId)!;

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <TopBar back="/app" title="New event" />

      <header className="flex justify-center px-5 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-paper px-5 pb-32">
        {step === 0 && (
          <div className="space-y-5 pt-2">
            <h1 className="font-serif text-2xl text-ink">What's happening?</h1>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Event name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vikings tailgate, park playdate, trail run..."
                className="mt-1.5 w-full rounded-2xl bg-card px-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Community</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {COMMUNITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCommunityId(c.id)}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                      communityId === c.id
                        ? "bg-primary text-primary-foreground shadow-warm-sm"
                        : "bg-card text-foreground ring-1 ring-border/60"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what to expect — keep it casual."
                rows={4}
                className="mt-1.5 w-full resize-none rounded-2xl bg-card px-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 pt-2">
            <h1 className="font-serif text-2xl text-ink">When and where?</h1>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl bg-card px-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl bg-card px-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="US Bank Stadium · Lot C"
                className="mt-1.5 w-full rounded-2xl bg-card px-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="mt-2 grid h-32 place-items-center rounded-2xl bg-muted text-xs text-muted-foreground topo-bg">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Map preview
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">How many people?</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={`rounded-2xl px-2 py-3 text-center transition ${
                      size === s.id
                        ? "bg-primary text-primary-foreground shadow-warm-sm"
                        : "bg-card ring-1 ring-border/60"
                    }`}
                  >
                    <p className="text-sm font-semibold">{s.label}</p>
                    <p className="text-[10px] opacity-80">{s.help}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="pt-2">
            <h1 className="font-serif text-2xl text-ink">Look good?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's exactly how others will see it.
            </p>

            <div className="mt-4 rounded-2xl bg-card p-4 shadow-warm-sm ring-1 ring-border/60">
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {community.name}
              </span>
              <h3 className="mt-2 font-serif text-base text-foreground">
                {name || "Untitled event"}
              </h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {date || "—"} · {time || "—"}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {location || "Add a spot"}
              </p>
              {description && (
                <p className="mt-3 text-sm text-foreground">{description}</p>
              )}
            </div>
          </div>
        )}
      </main>

      <div className="absolute inset-x-0 bottom-0 flex gap-2 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="grid h-12 w-12 place-items-center rounded-full bg-muted text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => (step === 2 ? nav({ to: "/app" }) : setStep((s) => s + 1))}
          className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-warm hover:brightness-105"
        >
          {step === 0 && "When and where"}
          {step === 1 && "Preview"}
          {step === 2 && "Make it happen"}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
