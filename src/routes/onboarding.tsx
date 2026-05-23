import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Camera } from "lucide-react";
import { PillChip, EventCard, GathrButton } from "@/components/ui";
import { useGathr } from "@/lib/GathrContext";
import { EVENTS, formatEventDate } from "@/lib/gather-data";
import type { AvatarGroupItem } from "@/components/ui/AvatarGroup";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Gathr — Get set up" }] }),
  component: Onboarding,
});

const NEIGHBORHOODS = [
  "Downtown MPLS",
  "Eagan",
  "Uptown",
  "Northeast",
  "St. Paul",
  "Bloomington",
  "Edina",
  "Maple Grove",
  "Plymouth",
  "Woodbury",
];

const INTEREST_CHIPS = [
  "Sports fan",
  "Outdoors",
  "Family stuff",
  "Food & drink",
  "Fitness",
  "Live music",
  "Games & trivia",
  "Arts & making",
];

// 3 events from mock data for the payoff screen
const PAYOFF_EVENTS = EVENTS.slice(0, 3);

function toAvatarItems(attendees: { id: string; firstName: string; avatarUrl?: string }[]): AvatarGroupItem[] {
  return attendees.map((u) => ({
    initials: u.firstName.slice(0, 2).toUpperCase(),
    src: u.avatarUrl,
    alt: u.firstName,
  }));
}

// Slide variants — direction flips based on whether going forward or backward
function slideVariants(direction: 1 | -1) {
  return {
    initial: { opacity: 0, x: direction * 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction * -40 },
  };
}

const SLIDE_TRANSITION = { type: "spring" as const, stiffness: 240, damping: 26 };

function Onboarding() {
  const nav = useNavigate();
  const { updateUser } = useGathr();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Step 1
  const [name, setName] = useState("");

  // Step 2
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [neighborhood, setNeighborhood] = useState("");
  const [neighborhoodFallback, setNeighborhoodFallback] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3
  const [interests, setInterests] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const effectiveNeighborhood = neighborhood || neighborhoodFallback;

  const canProceed =
    (step === 0 && name.trim().length >= 2) ||
    (step === 1 && effectiveNeighborhood.length > 0) ||
    (step === 2 && (interests.trim().length > 0 || activeChips.length > 0)) ||
    step === 3;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoSrc(url);
  };

  const toggleInterestChip = useCallback((chip: string) => {
    setActiveChips((prev) => {
      const isOn = prev.includes(chip);
      const next = isOn ? prev.filter((c) => c !== chip) : [...prev, chip];

      // Sync chips into textarea as comma-separated
      setInterests((currentText) => {
        // Remove all chip values from the current text first
        const allChips = INTEREST_CHIPS;
        let base = currentText;
        for (const c of allChips) {
          base = base
            .split(", ")
            .filter((part) => part !== c)
            .join(", ");
        }
        base = base.replace(/^,\s*|,\s*$/, "").trim();

        const chipStr = next.join(", ");
        if (!base && !chipStr) return "";
        if (!base) return chipStr;
        if (!chipStr) return base;
        return `${base}, ${chipStr}`;
      });

      return next;
    });
  }, []);

  const handleFinish = () => {
    updateUser({
      firstName: name.trim(),
      neighborhood: effectiveNeighborhood,
    });
    nav({ to: "/app" });
  };

  const ctaLabel =
    step === 0 ? "Next" :
    step === 1 ? "Almost done" :
    step === 2 ? "Find my people" :
    "Start exploring";

  const handleCta = step === 3 ? handleFinish : goNext;

  return (
    <div className="fixed inset-0 flex flex-col bg-gathr-cream overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0">
        <motion.button
          onClick={goBack}
          aria-label="Go back"
          whileTap={{ scale: 0.98 }}
          className={`grid h-9 w-9 place-items-center rounded-full text-gathr-charcoal transition hover:bg-gathr-cream-dark ${
            step === 0 || step === 3 ? "invisible pointer-events-none" : ""
          }`}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </motion.button>

        {/* Progress dots — 3 dots for steps 0-2; hidden on payoff */}
        <div className="flex gap-2">
          {step < 3 ? (
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full"
                animate={{
                  backgroundColor: i <= step ? "#2D5F3F" : "transparent",
                  borderColor: i <= step ? "#2D5F3F" : "#B8B4AD",
                  borderWidth: "2px",
                  borderStyle: "solid",
                }}
                transition={{ duration: 0.3 }}
              />
            ))
          ) : (
            <span className="h-2 w-2" />
          )}
        </div>

        {/* Spacer to balance header */}
        <div className="h-9 w-9" />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-6 pt-10 pb-10 sm:max-w-lg sm:rounded-card-lg sm:shadow-warm sm:bg-gathr-cream sm:mt-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              variants={slideVariants(direction)}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={SLIDE_TRANSITION}
            >
              {/* ── Step 1: Name ── */}
              {step === 0 && (
                <div>
                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    What should we call you?
                  </h1>
                  <p className="mt-2 text-base text-gathr-warm-gray">
                    Just your first name is perfect.
                  </p>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && canProceed && goNext()}
                    placeholder="Your first name"
                    className="mt-10 w-full h-14 bg-transparent text-xl text-gathr-charcoal border-b-2 border-gathr-warm-gray-light focus:border-gathr-amber focus:outline-none transition-colors placeholder:text-gathr-warm-gray-light"
                  />
                </div>
              )}

              {/* ── Step 2: Photo + Location ── */}
              {step === 1 && (
                <div>
                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    Hey,{" "}
                    <span className="text-gathr-amber">{name}</span>.
                  </h1>

                  {/* Photo upload */}
                  <div className="mt-6 flex flex-col items-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    {photoSrc ? (
                      <div className="flex flex-col items-center gap-2">
                        <motion.img
                          src={photoSrc}
                          alt="Your photo"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="h-[120px] w-[120px] rounded-full object-cover ring-2 ring-gathr-amber/30"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-gathr-warm-gray hover:text-gathr-charcoal transition"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border-2 border-dashed border-gathr-warm-gray-light text-gathr-warm-gray hover:border-gathr-amber/60 transition"
                        aria-label="Add a photo"
                      >
                        <Camera className="h-7 w-7" strokeWidth={1.5} />
                      </button>
                    )}
                    <p className="mt-2 text-sm text-gathr-warm-gray text-center">
                      Add a photo so people recognize you at events
                    </p>
                  </div>

                  {/* Neighborhood */}
                  <div className="mt-8">
                    <p className="text-base text-gathr-charcoal">
                      What part of town are you in?
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {NEIGHBORHOODS.map((n) => (
                        <PillChip
                          key={n}
                          label={n}
                          active={neighborhood === n}
                          onToggle={() =>
                            setNeighborhood((prev) => (prev === n ? "" : n))
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gathr-warm-gray mb-2">
                        Or type your neighborhood
                      </p>
                      <input
                        value={neighborhoodFallback}
                        onChange={(e) => {
                          setNeighborhoodFallback(e.target.value);
                          if (e.target.value) setNeighborhood("");
                        }}
                        placeholder="Your neighborhood"
                        className="w-full h-10 bg-transparent text-base text-gathr-charcoal border-b border-gathr-warm-gray-light focus:border-gathr-amber focus:outline-none transition-colors placeholder:text-gathr-warm-gray-light"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Interests ── */}
              {step === 2 && (
                <div>
                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    What do you like doing on weekends?
                  </h1>
                  <p className="mt-2 text-sm text-gathr-warm-gray">
                    The more you tell us, the better your matches.
                  </p>

                  <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="Watching the Vikes, hiking with the kids, trying new breweries, pickup basketball... anything goes."
                    rows={4}
                    className="mt-6 w-full min-h-[120px] resize-none rounded-card-sm border border-gathr-warm-gray-light focus:border-gathr-amber focus:outline-none p-4 bg-transparent text-base text-gathr-charcoal placeholder:text-gathr-warm-gray-light transition-colors"
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {INTEREST_CHIPS.map((chip) => (
                      <PillChip
                        key={chip}
                        label={chip}
                        active={activeChips.includes(chip)}
                        onToggle={() => toggleInterestChip(chip)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4: Payoff ── */}
              {step === 3 && (
                <div className="relative">
                  {/* Ambient amber glow behind cards */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-64 rounded-full opacity-30"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, #2D5F3F55 0%, transparent 70%)",
                    }}
                  />

                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    Here's what's happening near you,{" "}
                    <span className="text-gathr-amber">{name || "friend"}</span>
                  </h1>

                  <div className="mt-6 flex flex-col gap-3">
                    {PAYOFF_EVENTS.map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.1,
                          duration: 0.35,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <EventCard
                          id={event.id}
                          name={event.name}
                          location={event.location}
                          dateTime={formatEventDate(event.dateTime)}
                          going={event.totalAttendees}
                          community={event.communityName}
                          soon={event.isSoon}
                          attendees={toAvatarItems(event.attendees)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Secondary link */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleFinish}
                      className="text-sm text-gathr-warm-gray hover:text-gathr-charcoal transition"
                    >
                      Set up your profile later
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* CTA button — always visible, below the step content */}
          <div className="mt-10 flex justify-center">
            <GathrButton
              variant="primary"
              size="lg"
              disabled={!canProceed}
              onClick={handleCta}
              className="w-full max-w-xs"
            >
              {ctaLabel}
            </GathrButton>
          </div>
        </div>
      </main>
    </div>
  );
}
