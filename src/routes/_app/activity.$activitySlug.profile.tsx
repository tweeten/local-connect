import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { TopBar, PillChip, GathrButton } from "@/components/ui";
import { ScoreSlider } from "@/components/ui/ScoreSlider";
import { useGathr, useUserProfile } from "@/lib/GathrContext";
import type { ActivityProfileField, IntensityLevel } from "@/lib/activity-framework";
import type { ScoreSliderZone } from "@/components/ui/ScoreSlider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/activity/$activitySlug/profile")({
  component: ActivityProfileComponent,
  head: () => ({ meta: [{ title: "Gathr — Activity Profile" }] }),
});

// ── Constants ──────────────────────────────────────────────────────────────────

const FREQUENCY_OPTIONS = [
  "Once a week",
  "2-3x a week",
  "4+ times a week",
  "A few times a month",
] as const;

const GOAL_CHIPS = [
  "Break 100",
  "Break 90",
  "Play weekly",
  "Find a regular group",
  "Get competitive",
  "Just enjoy being outside",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Derive `ScoreSliderZone[]` from a range field definition.
 * For golf the zones carry intensity semantics; for any other activity we
 * split the range into 4 equal segments with neutral colours.
 */
function buildZones(field: ActivityProfileField): ScoreSliderZone[] {
  const { min = 0, max = 100 } = field.range ?? {};
  const span = max - min;
  const quarter = Math.round(span / 4);

  const PALETTE = ["#2D5F3F", "#3B82F6", "#D97706", "#9B8E82"];

  return [
    { min, max: min + quarter - 1,         label: "Tier 1", color: PALETTE[0] },
    { min: min + quarter, max: min + quarter * 2 - 1, label: "Tier 2", color: PALETTE[1] },
    { min: min + quarter * 2, max: min + quarter * 3 - 1, label: "Tier 3", color: PALETTE[2] },
    { min: min + quarter * 3, max,          label: "Tier 4", color: PALETTE[3] },
  ];
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface FieldSectionProps {
  field: ActivityProfileField;
  value: unknown;
  onChange: (fieldId: string, value: unknown) => void;
}

function FieldSection({ field, value, onChange }: FieldSectionProps) {
  const handleSingleSelect = (optValue: string) => {
    onChange(field.id, value === optValue ? "" : optValue);
  };

  const handleMultiSelect = (optValue: string) => {
    const current = Array.isArray(value) ? (value as string[]) : [];
    const next = current.includes(optValue)
      ? current.filter((v) => v !== optValue)
      : [...current, optValue];
    onChange(field.id, next);
  };

  return (
    <div>
      <h2 className="font-display text-xl text-gathr-charcoal">{field.label}</h2>

      {field.type === "range" && field.range && (
        <div className="mt-5">
          <ScoreSlider
            min={field.range.min}
            max={field.range.max}
            value={typeof value === "number" ? value : Math.round((field.range.min + field.range.max) / 2)}
            onChange={(v) => onChange(field.id, v)}
            zones={buildZones(field)}
          />
        </div>
      )}

      {field.type === "select" && field.options && (
        <div className="mt-4 flex flex-wrap gap-2">
          {field.options.map((opt) => (
            <PillChip
              key={opt.value}
              label={opt.label}
              active={value === opt.value}
              onToggle={() => handleSingleSelect(opt.value)}
            />
          ))}
        </div>
      )}

      {field.type === "multi-select" && field.options && (
        <div className="mt-4 flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const selected = Array.isArray(value) && (value as string[]).includes(opt.value);
            return (
              <PillChip
                key={opt.value}
                label={opt.label}
                active={selected}
                onToggle={() => handleMultiSelect(opt.value)}
              />
            );
          })}
        </div>
      )}

      {field.type === "text" && (
        <input
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={`Enter your ${field.label.toLowerCase()}`}
          className="mt-5 w-full h-14 bg-transparent text-base text-gathr-charcoal border-b-2 border-gathr-warm-gray-light focus:border-gathr-amber focus:outline-none transition-colors placeholder:text-gathr-warm-gray-light"
        />
      )}

      {field.type === "frequency" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <PillChip
              key={opt}
              label={opt}
              active={value === opt}
              onToggle={() => onChange(field.id, value === opt ? "" : opt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface IntensityCardProps {
  level: IntensityLevel;
  selected: boolean;
  onSelect: (id: string) => void;
}

function IntensityCard({ level, selected, onSelect }: IntensityCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(level.id)}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "w-full text-left rounded-card-lg border-2 px-5 py-4 transition-colors duration-200 cursor-pointer",
        selected
          ? "border-gathr-forest bg-gathr-forest/5"
          : "border-gathr-warm-gray-light bg-white hover:border-gathr-warm-gray",
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn(
            "font-display text-base leading-snug",
            selected ? "text-gathr-charcoal" : "text-gathr-charcoal",
          )}>
            {level.label}
          </p>
          <p className="mt-1 text-sm text-gathr-warm-gray leading-snug">
            {level.description}
          </p>
        </div>
        <span className={cn(
          "mt-0.5 shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
          selected ? "border-gathr-forest bg-gathr-forest" : "border-gathr-warm-gray-light",
        )}>
          {selected && (
            <span className="h-2 w-2 rounded-full bg-white" />
          )}
        </span>
      </div>
    </motion.button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

function ActivityProfileComponent() {
  const { activitySlug } = Route.useParams();
  const nav = useNavigate();
  const { state, updateProfile } = useGathr();

  const activity = state.activities.find((a) => a.slug === activitySlug);
  const existingProfile = useUserProfile(activity?.id ?? "");

  // ── Local form state, pre-filled from existing profile ─────────────────────

  const [fieldValues, setFieldValues] = useState<Record<string, unknown>>(
    () => existingProfile?.fieldValues ?? {},
  );

  const [intensityLevel, setIntensityLevel] = useState(
    existingProfile?.intensityLevel ?? "",
  );

  const [thirdObject, setThirdObject] = useState(
    existingProfile?.thirdObject ?? "",
  );

  const [frequencyGoal, setFrequencyGoal] = useState(
    existingProfile?.frequencyGoal ?? "",
  );

  const [saving, setSaving] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleFieldChange = useCallback((fieldId: string, value: unknown) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const toggleGoalChip = useCallback((chip: string) => {
    setThirdObject((prev) => {
      if (prev.includes(chip)) return prev;
      if (!prev.trim()) return chip;
      return `${prev.trim()}, ${chip}`;
    });
  }, []);

  const handleSave = async () => {
    if (!activity) return;
    setSaving(true);
    updateProfile(activity.id, {
      intensityLevel,
      thirdObject: thirdObject.trim(),
      frequencyGoal,
      fieldValues,
      updatedAt: new Date().toISOString(),
    });
    toast.success("Profile saved");
    nav({ to: "/activity/$activitySlug", params: { activitySlug } });
  };

  // ── Fallback if activity not found ─────────────────────────────────────────

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-base text-gathr-warm-gray">Activity not found.</p>
      </div>
    );
  }

  const sortedIntensityLevels = [...activity.intensityLevels].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="min-h-screen bg-gathr-cream">
      <TopBar
        title={`Your ${activity.name} Profile`}
        back={`/activity/${activitySlug}`}
        showBell={false}
      />

      <div className="mx-auto w-full max-w-md px-5 pt-20 pb-32 space-y-10">

        {/* ── Dynamic profile fields ── */}
        {activity.profileFields.map((field) => (
          <FieldSection
            key={field.id}
            field={field}
            value={fieldValues[field.id]}
            onChange={handleFieldChange}
          />
        ))}

        {/* ── Intensity level ── */}
        <div>
          <h2 className="font-display text-xl text-gathr-charcoal">
            Your Intensity Level
          </h2>
          <p className="mt-1 text-sm text-gathr-warm-gray">
            How seriously are you playing right now?
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {sortedIntensityLevels.map((level) => (
              <IntensityCard
                key={level.id}
                level={level}
                selected={intensityLevel === level.id}
                onSelect={setIntensityLevel}
              />
            ))}
          </div>
        </div>

        {/* ── Third Object ── */}
        <div>
          <h2 className="font-display text-xl text-gathr-charcoal">
            What's your third object?
          </h2>
          <p className="mt-1 text-sm text-gathr-warm-gray">
            The thing that keeps you coming back
          </p>
          <textarea
            value={thirdObject}
            onChange={(e) => setThirdObject(e.target.value)}
            placeholder="Break 90 by end of summer, play every Saturday morning, find a regular foursome..."
            rows={4}
            className="mt-5 w-full min-h-[120px] resize-none rounded-card-sm border border-gathr-warm-gray-light focus:border-gathr-amber focus:outline-none p-4 bg-transparent text-base text-gathr-charcoal placeholder:text-gathr-warm-gray-light transition-colors"
          />
          <div className="mt-3 flex flex-wrap gap-2">
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

      </div>

      {/* ── Sticky save button ── */}
      <div className="fixed bottom-0 inset-x-0 px-5 pb-8 pt-4 bg-gradient-to-t from-gathr-cream via-gathr-cream/95 to-transparent pointer-events-none">
        <div className="mx-auto w-full max-w-md pointer-events-auto">
          <GathrButton
            variant="primary"
            size="lg"
            loading={saving}
            onClick={handleSave}
            className="w-full"
          >
            Save profile
          </GathrButton>
        </div>
      </div>
    </div>
  );
}
