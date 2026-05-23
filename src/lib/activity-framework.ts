/**
 * activity-framework.ts
 *
 * Single source of truth for the coordination platform's domain type system.
 * Defines how activities, user profiles, matchmaking, and group coordination
 * are modeled across the entire app.
 *
 * Rules for this file:
 * - Types and pure utility functions only — no mock data, no side effects.
 * - All other modules that need domain types should import from here.
 */

// ─── Activity Definition ──────────────────────────────────────────────────────

/**
 * Defines a single selectable option for select/multi-select profile fields.
 */
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * Defines the numeric range configuration for range/number profile fields.
 */
export interface FieldRange {
  min: number;
  max: number;
  step: number;
  unit: string;
}

/**
 * Describes one input dimension a user fills out when setting up their profile
 * for a specific activity. The `type` determines which UI control is rendered
 * and which of the optional sub-fields (`options`, `range`) will be present.
 */
export interface ActivityProfileField {
  /** Stable key used to store the user's answer in `UserActivityProfile.fieldValues`. */
  id: string;
  /** Human-readable label shown in forms and summaries. */
  label: string;
  /**
   * Controls the input type rendered in the profile editor:
   * - `range`       — a slider within a numeric range
   * - `select`      — single-choice from a list of options
   * - `multi-select`— multiple choices from a list of options
   * - `number`      — a plain numeric input
   * - `text`        — a free-text input
   * - `frequency`   — a structured frequency picker ("2x per week", etc.)
   */
  type: "range" | "select" | "multi-select" | "number" | "text" | "frequency";
  /** Present when type is "select" or "multi-select". */
  options?: FieldOption[];
  /** Present when type is "range" or "number". */
  range?: FieldRange;
  /** Whether the user must fill this field before their profile is considered complete. */
  required: boolean;
}

/**
 * Represents one tier on the casual-to-competitive intensity spectrum for an
 * activity. Users self-select their tier during onboarding and the platform
 * uses it as a primary matching signal.
 */
export interface IntensityLevel {
  /** Stable key referenced by `UserActivityProfile.intensityLevel`. */
  id: string;
  /** Short display name shown in UI (e.g. "Weekend Warrior"). */
  label: string;
  /** One-sentence description of what this tier looks like in practice. */
  description: string;
  /** Sort order where 1 = most casual. Used to render the intensity spectrum. */
  order: number;
}

/**
 * Specifies one dimension the matching engine uses to compare two user profiles
 * against each other. Each criterion references a field in `ActivityProfileField`
 * and declares how strictly that field must agree for a good match.
 */
export interface MatchCriterion {
  /** References `ActivityProfileField.id` on the parent activity. */
  field: string;
  /**
   * Importance of this dimension relative to others (0 = ignored, 1 = decisive).
   * The matching engine normalises across all criteria to produce a 0–100 score.
   */
  weight: number;
  /**
   * How much variance is acceptable:
   * - `exact`    — values must be identical
   * - `similar`  — values may differ within a defined tolerance band
   * - `flexible` — direction/category match is enough; exact value is ignored
   */
  tolerance: "exact" | "similar" | "flexible";
}

/**
 * Describes the constraints and rules that define a valid match group for a
 * given activity. Every `Activity` carries exactly one `CoordinationSchema`.
 */
export interface CoordinationSchema {
  /** Minimum number of members required to form a group. */
  minGroupSize: number;
  /** Maximum number of members allowed in a group. */
  maxGroupSize: number;
  /** Preferred group size used as the primary target when forming groups. */
  idealGroupSize: number;
  /** Ordered list of profile dimensions the engine matches on. */
  matchCriteria: MatchCriterion[];
  /**
   * Whether sessions for this activity are expected to be on a fixed schedule,
   * arranged spontaneously, or either:
   * - `recurring` — e.g. every Saturday morning
   * - `ad-hoc`    — e.g. whenever 4 people are free
   * - `both`      — group decides
   */
  schedulingMode: "recurring" | "ad-hoc" | "both";
}

/**
 * Top-level descriptor for a hobby or sport the platform supports.
 * Contains everything needed to render the activity's UI, collect a user
 * profile, and run the matching engine.
 */
export interface Activity {
  /** Stable unique identifier. */
  id: string;
  /** Display name (e.g. "Golf", "Trail Running"). */
  name: string;
  /** URL-safe slug used in route params (e.g. "golf", "trail-running"). */
  slug: string;
  /** Lucide icon name used throughout the UI. */
  icon: string;
  /** Short description shown on activity discovery cards. */
  description: string;
  /** Rules and criteria the matching engine uses for this activity. */
  coordinationSchema: CoordinationSchema;
  /** Ordered list of profile fields the user fills out for this activity. */
  profileFields: ActivityProfileField[];
  /** Ordered list of intensity tiers from most casual (order 1) to most serious. */
  intensityLevels: IntensityLevel[];
}

// ─── User & Activity Profile ──────────────────────────────────────────────────

/**
 * A user's activity-specific profile — one instance per activity the user has
 * set up. Contains their self-reported skill data, goals, and field answers
 * that the matching engine reads.
 */
export interface UserActivityProfile {
  /** References `User.id`. */
  userId: string;
  /** References `Activity.id`. */
  activityId: string;
  /** References `IntensityLevel.id` on the parent activity. */
  intensityLevel: string;
  /**
   * The user's "Third Object" — a free-text personal goal that keeps them
   * engaged with the activity (e.g. "Break 90 this season").
   */
  thirdObject: string;
  /** How often the user wants to do the activity (e.g. "2x per week"). */
  frequencyGoal: string;
  /**
   * User answers keyed by `ActivityProfileField.id`.
   * Values are `unknown` because field types vary — consumers should narrow
   * based on the corresponding `ActivityProfileField.type`.
   */
  fieldValues: Record<string, unknown>;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** ISO 8601 last-updated timestamp. */
  updatedAt: string;
}

/**
 * A platform user. This is the canonical User definition — import from this
 * module for all domain types.
 */
export interface User {
  id: string;
  firstName: string;
  avatarUrl?: string;
  neighborhood: string;
  memberSince: string;
  eventsAttended: number;
  communitiesCount: number;
  connectionsCount: number;
  streakWeeks: number;
  /** All activity-specific profiles this user has set up, one per activity. */
  activityProfiles: UserActivityProfile[];
  /** IDs of `MatchGroup` objects this user belongs to. */
  matchGroups: string[];
}

// ─── Match Groups & Coordination Spaces ──────────────────────────────────────

/**
 * Tracks one member's progress toward a shared group goal.
 */
export interface MemberProgress {
  userId: string;
  current: number;
  target: number;
}

/**
 * A goal that the entire match group is working toward together.
 * Individual progress is tracked per-member so the UI can show a breakdown.
 */
export interface SharedGoal {
  /** Stable unique identifier. */
  id: string;
  /** Short title displayed in the Goals tab (e.g. "All break 90 before July"). */
  title: string;
  /** Optional ISO 8601 target date. */
  targetDate?: string;
  /** Each member's current progress toward the goal. */
  memberProgress: MemberProgress[];
}

/**
 * The private "temporary third space" for a match group — the coordination
 * layer that sits between the members' individual lives and the activity itself.
 * Contains the group's communication threads, upcoming sessions, and shared goals.
 */
export interface CoordinationSpace {
  /** Stable unique identifier. */
  id: string;
  /** References `MatchGroup.id`. */
  matchGroupId: string;
  /** IDs of discussion threads belonging to this space. */
  threads: string[];
  /** IDs of upcoming scheduled events/sessions for this group. */
  upcomingEvents: string[];
  /** Shared goals the group is collectively working toward. */
  sharedGoals: SharedGoal[];
}

/**
 * A small group of users matched by the platform to coordinate around a shared
 * activity. The `coordinationSpace` is the group's private workspace.
 */
export interface MatchGroup {
  /** Stable unique identifier. */
  id: string;
  /** References `Activity.id`. */
  activityId: string;
  /** Display name — auto-generated by the platform or set by a member. */
  name: string;
  /** Ordered list of `User.id` values for group members. */
  memberIds: string[];
  /**
   * Quality score for this match on a 0–100 scale.
   * Higher = members' profiles align more closely across all match criteria.
   */
  matchScore: number;
  /**
   * Lifecycle state of the group:
   * - `forming`  — not yet at ideal group size; actively recruiting
   * - `active`   — full group, actively coordinating
   * - `paused`   — group still exists but coordination has gone quiet
   * - `archived` — group has disbanded or been inactive for an extended period
   */
  status: "forming" | "active" | "paused" | "archived";
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** The group's private coordination workspace. */
  coordinationSpace: CoordinationSpace;
}

// ─── Pure Utility Functions ───────────────────────────────────────────────────

/**
 * Type guard that checks whether an unknown value conforms to the
 * `ActivityProfileField` shape. Useful when consuming field definitions
 * from external/dynamic sources.
 */
export function isActivityProfileField(value: unknown): value is ActivityProfileField {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.label === "string" &&
    typeof v.type === "string" &&
    ["range", "select", "multi-select", "number", "text", "frequency"].includes(v.type as string) &&
    typeof v.required === "boolean"
  );
}

/**
 * Looks up a profile field definition by its ID within a given activity.
 * Returns `undefined` if no field with that ID exists on the activity.
 */
export function getFieldById(
  activity: Activity,
  fieldId: string
): ActivityProfileField | undefined {
  return activity.profileFields.find((f) => f.id === fieldId);
}
