import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { PillChip, GathrButton, GathrAvatar } from "@/components/ui";
import { ScoreSlider } from "@/components/ui/ScoreSlider";
import { useGathr } from "@/lib/GathrContext";
import { MATCH_GROUPS, USERS } from "@/lib/mock-data";
import type { ScoreSliderZone } from "@/components/ui/ScoreSlider";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Gathr — Get set up" }] }),
  component: Onboarding,
});

// ── Constants ──────────────────────────────────────────────────────────────────

const AREA_CHIPS = [
  "Minneapolis",
  "St. Paul",
  "Eagan / Apple Valley",
  "Edina / Bloomington",
  "Maple Grove / Plymouth",
  "East Metro",
];

const SCORE_ZONES: ScoreSliderZone[] = [
  { min: 60, max: 79,  label: "Competitive",     color: "#2D5F3F" },
  { min: 80, max: 89,  label: "Getting Serious",  color: "#3B82F6" },
  { min: 90, max: 99,  label: "Building a Game",  color: "#D97706" },
  { min: 100, max: 130, label: "Weekend Warrior", color: "#9B8E82" },
];

const WALK_OPTIONS   = ["Walk", "Ride", "No preference"] as const;
const VIBE_OPTIONS   = ["Social round", "Focused practice", "Mix of both"] as const;
const GOAL_CHIPS     = [
  "Break 100",
  "Break 90",
  "Play weekly",
  "Find a regular group",
  "Get competitive",
  "Just enjoy being outside",
];

// ── Payoff data (Saturday Morning Crew) ───────────────────────────────────────

const PAYOFF_GROUP = MATCH_GROUPS[0]; // Saturday Morning Crew
const PAYOFF_MEMBERS = PAYOFF_GROUP.memberIds
  .slice(0, 3)
  .map((id) => USERS.find((u) => u.id === id))
  .filter(Boolean) as typeof USERS;

// Avg score computed from member skill-level field values
const AVG_SCORE = Math.round(
  PAYOFF_MEMBERS.reduce((sum, u) => {
    const profile = u.activityProfiles.find((p) => p.activityId === "golf");
    return sum + ((profile?.fieldValues["skill-level"] as number) ?? 90);
  }, 0) / PAYOFF_MEMBERS.length,
);

// ── Animation helpers ──────────────────────────────────────────────────────────

function slideVariants(direction: 1 | -1) {
  return {
    initial: { opacity: 0, x: direction * 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: direction * -40 },
  };
}

const SLIDE_TRANSITION = { type: "spring" as const, stiffness: 240, damping: 26 };

// ── Score → intensity ID ───────────────────────────────────────────────────────

function deriveIntensity(score: number): string {
  if (score <= 79)  return "competitive";
  if (score <= 89)  return "getting-serious";
  if (score <= 99)  return "building-a-game";
  return "weekend-warrior";
}

function walkingPrefToValue(pref: string): string {
  if (pref === "Walk")  return "always-walk";
  if (pref === "Ride")  return "prefer-cart";
  return "no-preference";
}

function vibeToValue(vibe: string): string {
  if (vibe === "Social round")      return "social";
  if (vibe === "Focused practice")  return "focused";
  return "mix";
}

// ── Component ─────────────────────────────────────────────────────────────────

function Onboarding() {
  const nav = useNavigate();
  const { updateUser, updateProfile } = useGathr();

  const [step, setStep]           = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Step 0
  const [name, setName] = useState("");

  // Step 1
  const [homeCourse, setHomeCourse] = useState("");
  const [areaChip, setAreaChip]     = useState("");

  // Step 2
  const [score, setScore]         = useState(95);
  const [walkingPref, setWalking] = useState("");
  const [vibePref, setVibe]       = useState("");

  // Step 3
  const [thirdObject, setThirdObject] = useState("");

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const canProceed =
    (step === 0 && name.trim().length >= 2) ||
    (step === 1 && (homeCourse.trim().length > 0 || areaChip.length > 0)) ||
    step === 2 ||
    (step === 3 && thirdObject.trim().length > 0) ||
    step === 4;

  const handleFinish = () => {
    updateUser({
      firstName:    name.trim(),
      neighborhood: areaChip || homeCourse.trim(),
    });
    updateProfile("golf", {
      intensityLevel: deriveIntensity(score),
      thirdObject:    thirdObject.trim(),
      frequencyGoal:  "Once a week",
      fieldValues: {
        "skill-level":         score,
        "walking-preference":  walkingPrefToValue(walkingPref),
        "social-preference":   vibeToValue(vibePref),
        "home-course":         homeCourse.trim() || areaChip,
      },
    });
    nav({ to: "/home" });
  };

  const toggleGoalChip = useCallback((chip: string) => {
    setThirdObject((prev) => {
      if (prev.includes(chip)) return prev;
      if (!prev.trim()) return chip;
      return `${prev.trim()}, ${chip}`;
    });
  }, []);

  const ctaLabel =
    step === 0 ? "Next" :
    step === 1 ? "Next" :
    step === 2 ? "Almost done" :
    step === 3 ? "Find my people" :
    "Let's go";

  const handleCta = step === 4 ? handleFinish : goNext;

  const showBack   = step > 0 && step < 4;
  const showDots   = step < 4;

  return (
    <div className="fixed inset-0 flex flex-col bg-gathr-cream overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0">
        <motion.button
          onClick={goBack}
          aria-label="Go back"
          whileTap={{ scale: 0.98 }}
          className={`grid h-9 w-9 place-items-center rounded-full text-gathr-charcoal transition hover:bg-gathr-cream-dark ${
            showBack ? "" : "invisible pointer-events-none"
          }`}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </motion.button>

        {/* Progress dots — 5 dots for steps 0-3; hidden on payoff */}
        <div className="flex gap-2">
          {showDots ? (
            [0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full"
                animate={{
                  backgroundColor: i <= step ? "#2D5F3F" : "transparent",
                  borderColor:     i <= step ? "#2D5F3F" : "#B8B4AD",
                  borderWidth:     "2px",
                  borderStyle:     "solid",
                }}
                transition={{ duration: 0.3 }}
              />
            ))
          ) : (
            <span className="h-2 w-2" />
          )}
        </div>

        <div className="h-9 w-9" />
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-6 pt-8 pb-10 sm:max-w-lg sm:rounded-card-lg sm:shadow-warm sm:bg-gathr-cream sm:mt-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              variants={slideVariants(direction)}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={SLIDE_TRANSITION}
            >

              {/* ── Step 0: Name ── */}
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
                    className="mt-10 w-full h-14 bg-transparent text-xl text-gathr-charcoal border-b-2 border-gathr-warm-gray-light focus:border-gathr-forest focus:outline-none transition-colors placeholder:text-gathr-warm-gray-light"
                  />
                </div>
              )}

              {/* ── Step 1: Where do you play ── */}
              {step === 1 && (
                <div>
                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    Where do you play?
                  </h1>
                  <p className="mt-2 text-base text-gathr-warm-gray">
                    We'll find people nearby so tee times are easy.
                  </p>
                  <input
                    autoFocus
                    value={homeCourse}
                    onChange={(e) => {
                      setHomeCourse(e.target.value);
                      if (e.target.value) setAreaChip("");
                    }}
                    placeholder="Home course or area (e.g. Eastview, Apple Valley)"
                    className="mt-8 w-full h-14 bg-transparent text-base text-gathr-charcoal border-b-2 border-gathr-warm-gray-light focus:border-gathr-forest focus:outline-none transition-colors placeholder:text-gathr-warm-gray-light"
                  />
                  <div className="mt-5 flex flex-wrap gap-2">
                    {AREA_CHIPS.map((area) => (
                      <PillChip
                        key={area}
                        label={area}
                        active={areaChip === area}
                        onToggle={() => {
                          const next = areaChip === area ? "" : area;
                          setAreaChip(next);
                          if (next) setHomeCourse("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2: What's your game like ── */}
              {step === 2 && (
                <div>
                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    What's your game like?
                  </h1>
                  <p className="mt-2 text-base text-gathr-warm-gray">
                    Be honest — we're matching you with people at your level.
                  </p>

                  <div className="mt-8">
                    <ScoreSlider
                      min={60}
                      max={130}
                      value={score}
                      onChange={setScore}
                      zones={SCORE_ZONES}
                    />
                  </div>

                  {/* Walk preference */}
                  <div className="mt-8">
                    <p className="text-sm font-semibold text-gathr-charcoal mb-3">
                      How do you like to play?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {WALK_OPTIONS.map((opt) => (
                        <PillChip
                          key={opt}
                          label={opt}
                          active={walkingPref === opt}
                          onToggle={() => setWalking((prev) => (prev === opt ? "" : opt))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Vibe preference */}
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gathr-charcoal mb-3">
                      What's the vibe?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {VIBE_OPTIONS.map((opt) => (
                        <PillChip
                          key={opt}
                          label={opt}
                          active={vibePref === opt}
                          onToggle={() => setVibe((prev) => (prev === opt ? "" : opt))}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Third Object ── */}
              {step === 3 && (
                <div>
                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    What keeps you coming back?
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-gathr-warm-gray">
                    This is your Third Object — the thing you're working toward
                  </p>
                  <p className="mt-1 text-sm text-gathr-warm-gray">
                    We'll match you with people chasing similar goals.
                  </p>

                  <textarea
                    autoFocus
                    value={thirdObject}
                    onChange={(e) => setThirdObject(e.target.value)}
                    placeholder="Break 90 by end of summer, play every Saturday morning, find a regular foursome, get good enough to not lose balls..."
                    rows={4}
                    className="mt-6 w-full min-h-[120px] resize-none rounded-card-sm border border-gathr-warm-gray-light focus:border-gathr-forest focus:outline-none p-4 bg-transparent text-base text-gathr-charcoal placeholder:text-gathr-warm-gray-light transition-colors"
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    {GOAL_CHIPS.map((chip) => (
                      <PillChip
                        key={chip}
                        label={chip}
                        active={thirdObject.includes(chip)}
                        onToggle={() => toggleGoalChip(chip)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4: Payoff ── */}
              {step === 4 && (
                <div>
                  {/* Ambient glow */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-64 rounded-full opacity-30"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, #2D5F3F55 0%, transparent 70%)",
                    }}
                  />

                  <h1 className="font-display text-2xl text-gathr-charcoal leading-snug">
                    We found your people,{" "}
                    <span className="text-gathr-forest">{name || "friend"}</span>
                  </h1>

                  {/* Match group card */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-6 rounded-card-lg bg-white shadow-warm p-5"
                  >
                    <p className="font-display text-lg text-gathr-charcoal">
                      {PAYOFF_GROUP.name}
                    </p>

                    {/* Avatars + names */}
                    <div className="mt-4 flex gap-4">
                      {PAYOFF_MEMBERS.map((member) => (
                        <div key={member.id} className="flex flex-col items-center gap-1.5">
                          <GathrAvatar
                            src={member.avatarUrl}
                            initials={member.firstName.slice(0, 2).toUpperCase()}
                            size="sm"
                            alt={member.firstName}
                          />
                          <span className="text-xs text-gathr-charcoal font-medium">
                            {member.firstName}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shared stats */}
                    <p className="mt-4 text-sm text-gathr-warm-gray">
                      Avg score: {AVG_SCORE} · Plays 2x/week · Walks
                    </p>

                    {/* Third objects */}
                    <div className="mt-3 flex flex-col gap-1">
                      {PAYOFF_MEMBERS.map((member) => {
                        const profile = member.activityProfiles.find(
                          (p) => p.activityId === "golf",
                        );
                        return profile?.thirdObject ? (
                          <p key={member.id} className="text-xs italic text-gathr-warm-gray">
                            {member.firstName}: "{profile.thirdObject}"
                          </p>
                        ) : null;
                      })}
                    </div>
                  </motion.div>

                  {/* First round together */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mt-4 rounded-card-sm bg-gathr-cream-dark px-5 py-4"
                  >
                    <p className="text-xs font-semibold text-gathr-warm-gray uppercase tracking-wide mb-1">
                      Your first round together
                    </p>
                    <p className="text-base font-semibold text-gathr-charcoal">
                      Saturday, May 24 · 7:06 AM
                    </p>
                    <p className="text-sm text-gathr-warm-gray">Eastview Golf Course, Apple Valley</p>
                  </motion.div>

                  {/* Secondary link */}
                  <div className="mt-5 text-center">
                    <button
                      onClick={handleFinish}
                      className="text-sm text-gathr-warm-gray hover:text-gathr-charcoal transition"
                    >
                      Set up later
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* CTA — always below step content */}
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
