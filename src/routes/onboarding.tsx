import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Camera, MapPin } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Gather — Get set up" }] }),
  component: Onboarding,
});

const NEIGHBORHOODS = ["Eagan", "Uptown", "St Paul · Mac-Groveland", "Northeast Mpls", "Edina", "Bloomington"];
const CHIPS = [
  "Sports fan",
  "Outdoor stuff",
  "Food & drink",
  "Family activities",
  "Fitness & running",
  "Music & concerts",
  "Games & trivia",
  "Arts & crafts",
];

function Onboarding() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [interests, setInterests] = useState("");
  const [chips, setChips] = useState<string[]>([]);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canNext =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && neighborhood.length > 0) ||
    (step === 2 && (interests.trim().length > 0 || chips.length > 0)) ||
    step === 3;

  const toggleChip = (c: string) => {
    setChips((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background topo-bg">
      <header className="flex items-center justify-between px-5 py-4">
        <button
          onClick={back}
          className={`grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 transition ${
            step === 0 ? "invisible" : "hover:bg-accent"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          Skip
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
            >
              {step === 0 && (
                <div className="text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-warm">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <h1 className="mt-6 font-serif text-3xl text-ink">
                    Hey — let's get you set up.
                  </h1>
                  <p className="mt-2 text-muted-foreground">What's your first name?</p>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    className="mt-8 w-full rounded-2xl bg-card px-5 py-4 text-center text-xl text-foreground shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="mt-4 text-xs text-muted-foreground">Takes about 60 seconds.</p>
                </div>
              )}

              {step === 1 && (
                <div className="text-center">
                  <h1 className="font-serif text-3xl text-ink">
                    Nice to meet you, {name || "friend"}.
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Drop a photo so people recognize you at events.
                  </p>
                  <button className="mx-auto mt-6 grid h-28 w-28 place-items-center rounded-full bg-card text-muted-foreground shadow-warm ring-2 ring-dashed ring-border hover:ring-primary/50">
                    <Camera className="h-7 w-7" />
                  </button>
                  <p className="mt-2 text-xs text-muted-foreground">Optional, but it helps.</p>

                  <div className="mt-8 text-left">
                    <p className="text-sm text-muted-foreground">What part of town are you in?</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {NEIGHBORHOODS.map((n) => (
                        <button
                          key={n}
                          onClick={() => setNeighborhood(n)}
                          className={`rounded-full px-3.5 py-2 text-sm transition ${
                            neighborhood === n
                              ? "bg-primary text-primary-foreground shadow-warm-sm"
                              : "bg-card text-foreground ring-1 ring-border/60 hover:ring-primary/40"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="font-serif text-3xl text-ink">
                    So {name || "friend"} — what do you like doing on weekends?
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Anything goes. Just tell us in your own words.
                  </p>
                  <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="Watching the Vikes, hiking, taking the kids to the park, trying new restaurants..."
                    rows={5}
                    className="mt-6 w-full resize-none rounded-2xl bg-card px-5 py-4 text-base text-foreground shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="mt-5 text-xs font-medium text-muted-foreground">
                    Or tap a few to get started
                  </p>
                  <div className={`mt-3 flex flex-wrap gap-2 transition ${interests.length > 0 ? "opacity-40" : ""}`}>
                    {CHIPS.map((c) => {
                      const on = chips.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleChip(c)}
                          className={`rounded-full px-3.5 py-2 text-sm transition ${
                            on
                              ? "bg-primary text-primary-foreground shadow-warm-sm"
                              : "bg-card text-foreground ring-1 ring-border/60 hover:ring-primary/40"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center">
                  <h1 className="font-serif text-3xl text-ink">
                    Here's what's happening near you, {name || "friend"}.
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Three things this weekend in {neighborhood || "your area"}.
                  </p>
                  <div className="mt-6 space-y-3 text-left">
                    {[
                      { name: "Vikings vs Packers tailgate", going: 47, when: "Sun · 1pm" },
                      { name: "Saturday trail run", going: 12, when: "Sat · 8am" },
                      { name: "Kids + coffee at the park", going: 8, when: "Sat · 10am" },
                    ].map((e) => (
                      <div
                        key={e.name}
                        className="rounded-2xl bg-card p-4 shadow-warm-sm ring-1 ring-border/60"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-serif text-base text-foreground">{e.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {e.going} going · {e.when}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-warm-sm">
                            Count me in
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center">
            <button
              disabled={!canNext}
              onClick={() => (step === 3 ? nav({ to: "/app" }) : next())}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-warm transition hover:brightness-105 disabled:opacity-40"
            >
              {step === 0 && "Next"}
              {step === 1 && "Almost there"}
              {step === 2 && "Find my people"}
              {step === 3 && "Explore the map"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
