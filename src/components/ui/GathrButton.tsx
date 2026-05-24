import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TRANSITION_SPRING } from "@/lib/design-tokens";

// Variant examples — labels should sound like a friend, not a robot:
// primary:   "Count me in" | "Make it happen" | "Show me more" | "Let's go"
// secondary: "Maybe later" | "See who's going" | "Tell me more"
// ghost:     "Skip for now" | "Not my scene" | "Learn more"

export interface GathrButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  loading?: boolean;
}

const sizeClasses = {
  default: "h-12 px-6 text-base",
  sm: "h-10 px-5 text-sm",
  lg: "h-14 px-8 text-lg",
};

const variantClasses = {
  primary:
    "bg-gathr-forest text-white rounded-full font-semibold shadow-warm hover:bg-gathr-forest-light disabled:opacity-50",
  secondary:
    "border-2 border-gathr-forest text-gathr-forest bg-transparent rounded-full font-semibold hover:bg-gathr-forest/10 disabled:opacity-50",
  ghost:
    "text-gathr-warm-gray bg-transparent hover:text-gathr-charcoal disabled:opacity-50",
};

function Spinner({ white }: { white: boolean }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", white ? "text-white" : "text-gathr-forest")}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function GathrButton({
  variant = "primary",
  size = "default",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: GathrButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      transition={TRANSITION_SPRING}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-body cursor-pointer transition-colors select-none",
        sizeClasses[size],
        variantClasses[variant],
        isDisabled && "cursor-not-allowed",
        className,
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? <Spinner white={variant === "primary"} /> : children}
    </motion.button>
  );
}
