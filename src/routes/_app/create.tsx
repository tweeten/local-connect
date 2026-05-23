import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TopBar, PillChip, EventCard, GathrButton } from "@/components/ui";
import { useGathr } from "@/lib/GathrContext";
import { TRANSITION_SPRING } from "@/lib/design-tokens";

export const Route = createFileRoute("/_app/create")({
  head: () => ({ meta: [{ title: "Gathr — Create an event" }] }),
  component: CreateEvent,
});

// Slide variants — direction flips based on forward/backward
function slideVariants(direction: 1 | -1) {
  return {
    initial: { opacity: 0, x: direction * 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction * -40 },
  };
}

const SLIDE_TRANSITION = { type: "spring" as const, stiffness: 240, damping: 26 };

const SIZE_OPTIONS = [
  { id: "small", label: "Small (2–5)" },
  { id: "medium", label: "Medium (5–15)" },
  { id: "open", label: "Open" },
];

function formatPreviewDateTime(date: string, time: string): string {
  if (!date && !time) return "Date & time TBD";
  if (!date) return time;
  const d = new Date(`${date}T${time || "00:00"}`);
  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (!time) return dateStr;
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${dateStr} · ${timeStr}`;
}

function CreateEvent() {
  const nav = useNavigate();
  const { state } = useGathr();

  const joinedCommunities = state.communities.filter((c) => c.isJoined);
  const allCommunities = state.communities;
  const defaultCommunityId = joinedCommunities[0]?.id ?? allCommunities[0]?.id ?? "";

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Form fields
  const [name, setName] = useState("");
  const [communityId, setCommunityId] = useState(defaultCommunityId);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("open");

  const [celebrating, setCelebrating] = useState(false);

  const selectedCommunity = allCommunities.find((c) => c.id === communityId);
  const canProceedStep0 = name.trim().length > 0 && communityId !== "";

  const goNext = () => {
    setDirection(1);
    setStep(1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(0);
  };

  const handleSubmit = async () => {
    setCelebrating(true);
    await new Promise((r) => setTimeout(r, 700));
    nav({ to: "/app" });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar back="/app" title="New event" />

      {/* Progress dots */}
      <header className="flex justify-center px-5 py-3 pt-16">
        <div className="flex gap-1.5">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-gathr-amber" : "bg-border"
              }`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            variants={slideVariants(direction)}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={SLIDE_TRANSITION}
          >
            {/* ── Step 0: What's happening? ── */}
            {step === 0 && (
              <div className="px-5 pt-2 space-y-6">
                <h1 className="font-display text-2xl text-foreground">
                  What's happening?
                </h1>

                {/* Event name — underline style */}
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canProceedStep0 && goNext()}
                  placeholder="Vikings tailgate, park playdate, trail run..."
                  className="w-full h-14 bg-transparent text-xl text-gathr-charcoal border-b-2 border-gathr-warm-gray-light focus:border-gathr-amber focus:outline-none transition-colors placeholder:text-gathr-warm-gray-light"
                />

                {/* Community selector */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Which community?
                  </label>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                    {(joinedCommunities.length > 0 ? joinedCommunities : allCommunities).map((c) => (
                      <PillChip
                        key={c.id}
                        label={c.name}
                        active={communityId === c.id}
                        onToggle={() => setCommunityId(c.id)}
                        className="shrink-0"
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What should people know? Keep it casual."
                    rows={4}
                    className="mt-1.5 w-full resize-none rounded-card-sm border border-border/60 p-4 min-h-[100px] text-base bg-card focus:outline-none focus:ring-2 focus:ring-gathr-amber/50 placeholder:text-gathr-warm-gray-light transition-shadow"
                  />
                </div>
              </div>
            )}

            {/* ── Step 1: When & Where + Live Preview ── */}
            {step === 1 && (
              <div className="px-5 pt-2">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
                  {/* Left/top: inputs */}
                  <div className="space-y-6">
                    {/* When */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        When?
                      </label>
                      <div className="mt-1.5 grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full rounded-2xl bg-card px-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-gathr-amber/50 accent-gathr-amber"
                          style={{ accentColor: "#2D5F3F", colorScheme: "light" }}
                        />
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full rounded-2xl bg-card px-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-gathr-amber/50"
                          style={{ accentColor: "#2D5F3F", colorScheme: "light" }}
                        />
                      </div>
                    </div>

                    {/* Where */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Where?
                      </label>
                      <div className="mt-1.5 relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gathr-warm-gray shrink-0 pointer-events-none" />
                        <input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="US Bank Stadium, Como Park, your backyard..."
                          className="w-full rounded-2xl bg-card pl-9 pr-4 py-3 text-base shadow-warm-sm ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-gathr-amber/50 placeholder:text-gathr-warm-gray-light"
                        />
                      </div>
                      {/* Map placeholder */}
                      <div className="mt-2 h-[120px] rounded-2xl bg-muted topo-bg grid place-items-center text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> Map preview
                        </span>
                      </div>
                    </div>

                    {/* How many */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        How many people?
                      </label>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {SIZE_OPTIONS.map((s) => (
                          <PillChip
                            key={s.id}
                            label={s.label}
                            active={size === s.id}
                            onToggle={() => setSize(s.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right/bottom: live preview */}
                  <div className="mt-8 lg:mt-0 lg:sticky lg:top-4">
                    <p className="text-xs tracking-widest text-gathr-warm-gray uppercase mb-3">
                      Preview
                    </p>
                    <motion.div
                      className="rounded-card-lg"
                      animate={
                        celebrating
                          ? {
                              boxShadow: [
                                "0 0 0px 0px rgba(212,137,63,0)",
                                "0 0 0px 18px rgba(212,137,63,0.35)",
                                "0 0 0px 0px rgba(212,137,63,0)",
                              ],
                            }
                          : { boxShadow: "0 0 0px 0px rgba(212,137,63,0)" }
                      }
                      transition={{ duration: 0.4 }}
                    >
                      <EventCard
                        id="preview"
                        name={name || "Your event"}
                        location={location || "Location TBD"}
                        dateTime={formatPreviewDateTime(date, time)}
                        going={1}
                        community={selectedCommunity?.name ?? "Community"}
                        attendees={[]}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer CTA */}
      <div className="absolute inset-x-0 bottom-0 flex gap-2 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        {step > 0 && (
          <motion.button
            onClick={goBack}
            whileTap={{ scale: 0.98 }}
            transition={TRANSITION_SPRING}
            className="grid h-12 w-12 place-items-center rounded-full bg-muted text-foreground hover:bg-accent transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </motion.button>
        )}
        <GathrButton
          variant="primary"
          size="default"
          disabled={step === 0 && !canProceedStep0}
          loading={celebrating}
          onClick={step === 0 ? goNext : handleSubmit}
          className="flex-1"
        >
          {step === 0 ? "Next" : "Make it happen"}
        </GathrButton>
      </div>
    </div>
  );
}
