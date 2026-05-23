import { motion } from "motion/react";
import { GathrButton, type GathrButtonProps } from "./GathrButton";
import { TRANSITION_GENTLE } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  headline: string;
  body?: string;
  ctaLabel?: string;
  onCta?: () => void;
  ctaProps?: Partial<GathrButtonProps>;
  className?: string;
}

function WarmIllustration() {
  return (
    <svg
      width="160"
      height="120"
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Soft overlapping circles suggesting gathering */}
      <circle cx="60" cy="70" r="44" fill="#2D5F3F" fillOpacity="0.18" />
      <circle cx="100" cy="60" r="38" fill="#E8A85C" fillOpacity="0.18" />
      <circle cx="80" cy="50" r="28" fill="#2D5F3F" fillOpacity="0.14" />
      <circle cx="55" cy="48" r="18" fill="#E8A85C" fillOpacity="0.12" />
      <circle cx="105" cy="78" r="22" fill="#2D5F3F" fillOpacity="0.10" />
      <circle cx="80" cy="72" r="14" fill="#E8A85C" fillOpacity="0.16" />
    </svg>
  );
}

export function EmptyState({
  headline,
  body,
  ctaLabel,
  onCta,
  ctaProps,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={TRANSITION_GENTLE}
      className={cn(
        "flex flex-col items-center justify-center text-center px-8 py-12 gap-4",
        className,
      )}
    >
      <WarmIllustration />
      <h3 className="font-display text-xl text-gathr-charcoal mt-2">{headline}</h3>
      {body && (
        <p className="font-body text-base text-gathr-warm-gray max-w-xs leading-relaxed">
          {body}
        </p>
      )}
      {ctaLabel && (
        <GathrButton variant="primary" onClick={onCta} {...ctaProps}>
          {ctaLabel}
        </GathrButton>
      )}
    </motion.div>
  );
}
