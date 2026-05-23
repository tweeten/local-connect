import { Link } from "@tanstack/react-router";
import { ChevronLeft, Search, Bell } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TRANSITION_SPRING } from "@/lib/design-tokens";

export interface TopBarProps {
  title?: string;
  back?: string;
  showSearch?: boolean;
  showBell?: boolean;
  notificationDot?: boolean;
  scrolled?: boolean;
  /** Renders the bar with full transparency and white/cream icon colors — for use over colored banners */
  overlay?: boolean;
  /** Custom node rendered on the right side, replacing search/bell */
  rightAction?: ReactNode;
  className?: string;
}

export function TopBar({
  title,
  back,
  showSearch = false,
  showBell = true,
  notificationDot = false,
  scrolled = false,
  overlay = false,
  rightAction,
  className,
}: TopBarProps) {
  const iconClass = overlay
    ? "text-white/90 hover:bg-white/15"
    : "text-gathr-charcoal hover:bg-gathr-cream-dark";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 transition-colors",
        overlay
          ? "bg-transparent"
          : scrolled
            ? "bg-gathr-cream/95 backdrop-blur-sm border-b border-gathr-warm-gray-light/60"
            : "bg-transparent",
        className,
      )}
      style={{ height: 56, paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Left: back arrow or wordmark */}
      <div className="flex items-center gap-2">
        {back ? (
          <>
            <Link
              to={back}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                overlay ? "text-white/90 hover:bg-white/15" : "bg-gathr-cream-dark text-gathr-charcoal hover:bg-gathr-cream",
              )}
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            {title && !overlay && (
              <h1 className="font-display text-lg text-gathr-charcoal">{title}</h1>
            )}
          </>
        ) : (
          <Link to="/" className="flex items-center">
            <img src="/gathr-logo.png" alt="Gathr" className="h-8 w-auto" />
          </Link>
        )}
      </div>

      {/* Right: custom action, or search + bell */}
      <div className="flex items-center gap-1">
        {rightAction ?? (
          <>
            {showSearch && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={TRANSITION_SPRING}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  iconClass,
                )}
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.75} />
              </motion.button>
            )}
            {showBell && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                transition={TRANSITION_SPRING}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  iconClass,
                )}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={1.75} />
                {notificationDot && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gathr-coral ring-2 ring-gathr-cream" />
                )}
              </motion.button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
