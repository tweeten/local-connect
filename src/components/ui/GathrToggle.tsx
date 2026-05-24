import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TRANSITION_DEFAULT } from "@/lib/design-tokens";

export interface GathrToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  className?: string;
}

export function GathrToggle({ checked, onChange, label, className }: GathrToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gathr-forest focus-visible:ring-offset-2",
        checked ? "bg-gathr-forest" : "bg-gathr-warm-gray-light",
        className,
      )}
      style={{ width: 48, height: 28 }}
    >
      <motion.span
        layout
        transition={TRANSITION_DEFAULT}
        className="block h-[22px] w-[22px] rounded-full bg-gathr-cream shadow-warm-sm"
        style={{ x: checked ? 20 : 0 }}
        animate={{ x: checked ? 20 : 0 }}
      />
    </button>
  );
}
