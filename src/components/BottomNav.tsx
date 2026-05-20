import { Link, useLocation } from "@tanstack/react-router";
import { Compass, MapPin, Users } from "lucide-react";

const TABS = [
  { to: "/app", icon: MapPin, label: "Happening" },
  { to: "/communities", icon: Users, label: "Communities" },
  { to: "/explore", icon: Compass, label: "Explore" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="flex items-center justify-between border-t border-border/60 bg-background/95 px-4 py-2.5 backdrop-blur">
      <Link to="/profile" className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-coral text-sm font-bold text-primary-foreground shadow-warm-sm ring-2 ring-background">
          AM
        </span>
        <span className="hidden text-sm font-semibold text-foreground sm:inline">Alex</span>
      </Link>
      <div className="flex items-center gap-1">
        {TABS.map(({ to, icon: Icon, label }) => {
          const active = pathname === to || (to === "/app" && pathname.startsWith("/event"));
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 transition ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={`text-[10px] ${active ? "font-semibold" : ""}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
