/**
 * Card Style Guide — use exactly these 3 patterns:
 *
 * PATTERN A (Content Card): bg-white/80 rounded-2xl shadow-warm p-4
 *   → Primary content: sessions, threads, groups, goals
 *
 * PATTERN B (Inline Row): bg-gathr-cream-dark rounded-xl px-4 py-3
 *   → List items: recent rounds, compact sessions, settings rows
 *
 * PATTERN C (Stat Cell): bg-white/60 rounded-xl shadow-warm-sm p-3
 *   → Small data blocks: score, frequency, stat counters
 */

export { GathrButton } from "./GathrButton";
export type { GathrButtonProps } from "./GathrButton";

export { GathrAvatar } from "./GathrAvatar";
export type { GathrAvatarProps } from "./GathrAvatar";

export { AvatarGroup } from "./AvatarGroup";
export type { AvatarGroupProps, AvatarGroupItem } from "./AvatarGroup";

export { ThreadCard } from "./ThreadCard";
export type { ThreadCardProps } from "./ThreadCard";

export { PillChip } from "./PillChip";
export type { PillChipProps } from "./PillChip";

export { SectionHeader } from "./SectionHeader";
export type { SectionHeaderProps } from "./SectionHeader";

export { StatCounter } from "./StatCounter";
export type { StatCounterProps } from "./StatCounter";

export { BottomNav } from "./BottomNav";
export type { BottomNavProps } from "./BottomNav";

export { TopBar } from "./TopBar";
export type { TopBarProps } from "./TopBar";

export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { GathrToggle } from "./GathrToggle";
export type { GathrToggleProps } from "./GathrToggle";

export { ScoreSlider } from "./ScoreSlider";
export type { ScoreSliderProps, ScoreSliderZone } from "./ScoreSlider";

export { GroupCard } from "./GroupCard";
export type { GroupCardProps } from "./GroupCard";

export { MatchPreviewCard } from "./MatchPreviewCard";
export type { MatchPreviewCardProps } from "./MatchPreviewCard";

export { IntensitySpectrum } from "./IntensitySpectrum";
export type { IntensitySpectrumProps } from "./IntensitySpectrum";
