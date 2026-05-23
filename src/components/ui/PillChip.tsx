import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface PillChipProps {
  label: string;
  active?: boolean;
  onToggle?: (active: boolean) => void;
  className?: string;
}

export function PillChip({ label, active = false, onToggle, className }: PillChipProps) {
  return (
    <motion.button
      onClick={() => onToggle?.(!active)}
      className={cn(
        "h-8 rounded-full px-4 text-sm font-body cursor-pointer select-none transition-colors duration-200",
        active
          ? "bg-gathr-amber text-white"
          : "bg-gathr-cream-dark text-gathr-charcoal border border-gathr-warm-gray-light hover:border-gathr-warm-gray",
        className,
      )}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      aria-pressed={active}
    >
      {label}
    </motion.button>
  );
}
