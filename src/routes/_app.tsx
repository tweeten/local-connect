import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { BottomNav } from "@/components/ui";
import { PAGE_VARIANTS } from "@/lib/design-tokens";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

// Tab routes use crossfade only — no slide — to avoid the "everything moves" feel.
const TAB_PATHS = ["/home", "/activity/golf", "/profile"];

// Routes where the BottomNav should be hidden (full-screen flows with their own CTAs).
const NO_NAV_PATHS = ["/onboarding", "/activity/golf/profile"];

function AppShell() {
  const { pathname } = useLocation();

  const isTab = TAB_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const showNav = !NO_NAV_PATHS.some((p) => pathname.startsWith(p));

  // Tab siblings: crossfade only (opacity).
  // Detail screens: subtle slide up (y: 12px) + fade, using PAGE_VARIANTS token.
  const motionProps = isTab
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
      }
    : {
        variants: PAGE_VARIANTS,
        initial: "initial",
        animate: "animate",
        exit: "exit",
      };

  return (
    <div className="fixed inset-0 bg-background">
      {/*
       * AnimatePresence mode="wait" ensures the exiting route fully fades out
       * before the entering route fades in. The key drives the transition.
       */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} className="absolute inset-0" {...(motionProps as object)}>
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {/*
       * BottomNav sits outside AnimatePresence so it never animates during
       * route transitions — it stays persistent across all in-shell screens.
       * It is hidden for full-screen flows (onboarding, activity profile editor).
       */}
      {showNav && <BottomNav />}
    </div>
  );
}
