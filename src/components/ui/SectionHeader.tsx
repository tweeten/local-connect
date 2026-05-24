import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  linkLabel?: string;
  onLinkClick?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  linkLabel,
  onLinkClick,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <h2 className="font-display text-xl text-gathr-charcoal">{title}</h2>
      {linkLabel && (
        <motion.button
          onClick={onLinkClick}
          whileTap={{ scale: 0.98 }}
          className="text-sm text-gathr-forest hover:underline font-body"
        >
          {linkLabel}
        </motion.button>
      )}
    </div>
  );
}
