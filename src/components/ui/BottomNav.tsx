import { Link, useLocation } from "@tanstack/react-router";
import { MapPin, Users, Compass, Mail } from "lucide-react";
import { GathrAvatar } from "./GathrAvatar";
import { cn } from "@/lib/utils";
import { useGathr } from "@/lib/GathrContext";

const TABS = [
  { to: "/app",         icon: MapPin,  label: "Happening" },
  { to: "/communities", icon: Users,   label: "Communities" },
  { to: "/explore",     icon: Compass, label: "Explore" },
] as const;

export interface BottomNavProps {
  userInitials?: string;
  userSrc?: string;
}

export function BottomNav({ userSrc }: BottomNavProps) {
  const { pathname } = useLocation();
  const { state } = useGathr();
  const userInitials = state.currentUser.firstName.slice(0, 2).toUpperCase();

  const messagesActive = pathname === "/messages" || pathname.startsWith("/messages/");

  const profileActive = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <nav
      role="navigation"
      aria-label="Main"
      className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-between bg-gathr-cream border-t border-gathr-warm-gray-light shadow-[0_-2px_12px_rgba(44,44,44,0.06)] px-4"
      style={{ height: 64, paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Left side: profile + messages */}
      <div className="flex items-center gap-1">
        {/* Profile avatar */}
        <Link
          to="/profile"
          aria-label="Profile"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
            profileActive ? "text-gathr-amber" : "text-gathr-warm-gray hover:text-gathr-charcoal",
          )}
        >
          <GathrAvatar src={userSrc} initials={userInitials} size="xs" />
        </Link>

        {/* Messages tab */}
        <Link
          to="/messages"
          aria-label="Messages"
          aria-current={messagesActive ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
            messagesActive ? "text-gathr-amber" : "text-gathr-warm-gray hover:text-gathr-charcoal",
          )}
        >
          <Mail className="h-5 w-5" strokeWidth={1.75} />
          <span className={cn("text-[10px] font-body", messagesActive && "font-semibold")}>
            Messages
          </span>
        </Link>
      </div>

      {/* Three center/right tabs */}
      <div className="flex items-center gap-1">
        {TABS.map(({ to, icon: Icon, label }) => {
          const active =
            pathname === to || (to === "/app" && pathname.startsWith("/event"));
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors",
                active ? "text-gathr-amber" : "text-gathr-warm-gray hover:text-gathr-charcoal",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span className={cn("text-[10px] font-body", active && "font-semibold")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
