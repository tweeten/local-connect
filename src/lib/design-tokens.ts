import type { Transition, Variants } from "motion/react";

// Standard UI transitions (buttons, dropdowns, tooltips)
export const TRANSITION_DEFAULT: Transition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1],
};

// Slower, softer transitions (page changes, modal entrances)
export const TRANSITION_GENTLE: Transition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1],
};

// Spring physics for interactive feedback
export const TRANSITION_SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

// Card press — subtle scale only, never color change
export const CARD_PRESS = {
  whileTap: { scale: 0.98 },
  transition: TRANSITION_SPRING,
} as const;

// Delay between staggered siblings in a list
export const STAGGER_CHILDREN = 0.05;

// Page enter animation
export const PAGE_ENTER: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Page exit animation
export const PAGE_EXIT: Variants = {
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Convenience: combine enter + exit into a single variants object for AnimatePresence
export const PAGE_VARIANTS: Variants = {
  ...PAGE_ENTER,
  ...PAGE_EXIT,
};

// Stagger container — apply to the parent wrapping a list
export const STAGGER_CONTAINER: Variants = {
  animate: {
    transition: {
      staggerChildren: STAGGER_CHILDREN,
    },
  },
};
