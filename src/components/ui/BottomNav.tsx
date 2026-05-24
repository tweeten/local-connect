import { Link, useLocation } from "@tanstack/react-router";
import { Home, Users, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGathr } from "@/lib/GathrContext";

export interface BottomNavProps {
  userInitials?: string;
  userSrc?: string;
}

const tabClass = (active: boolean) =>
  cn(
    "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors",
    active ? "text-gathr-forest" : "text-gathr-warm-gray hover:text-gathr-charcoal",
  );

const labelClass = (active: boolean) =>
  cn("text-[10px] font-body", active && "font-semibold");

export function BottomNav(_props: BottomNavProps) {
  const { pathname } = useLocation();
  const { state } = useGathr();
  const activitySlug = state.activities[0]?.slug ?? "golf";

  const homeActive = pathname === "/home";
  const groupsActive = pathname === "/groups" || pathname.startsWith("/group/");
  const activityActive = pathname.startsWith("/activity/");
  const profileActive = pathname === "/profile" || pathname.startsWith("/profile/");

  return (
    <nav
      role="navigation"
      aria-label="Main"
      className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-around bg-gathr-cream border-t border-gathr-warm-gray-light shadow-[0_-2px_12px_rgba(44,44,44,0.06)] px-4"
      style={{ height: 64, paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link to="/home" aria-label="Home" aria-current={homeActive ? "page" : undefined} className={tabClass(homeActive)}>
        <Home className="h-5 w-5" strokeWidth={1.75} />
        <span className={labelClass(homeActive)}>Home</span>
      </Link>

      <Link to="/groups" aria-label="Groups" aria-current={groupsActive ? "page" : undefined} className={tabClass(groupsActive)}>
        <Users className="h-5 w-5" strokeWidth={1.75} />
        <span className={labelClass(groupsActive)}>Groups</span>
      </Link>

      <Link
        to="/activity/$activitySlug"
        params={{ activitySlug }}
        aria-label="Activity"
        aria-current={activityActive ? "page" : undefined}
        className={tabClass(activityActive)}
      >
        <Target className="h-5 w-5" strokeWidth={1.75} />
        <span className={labelClass(activityActive)}>Activity</span>
      </Link>

      <Link to="/profile" aria-label="Profile" aria-current={profileActive ? "page" : undefined} className={tabClass(profileActive)}>
        <User className="h-5 w-5" strokeWidth={1.75} />
        <span className={labelClass(profileActive)}>Profile</span>
      </Link>
    </nav>
  );
}
