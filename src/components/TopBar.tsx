import { Link } from "@tanstack/react-router";
import { Bell, ChevronLeft, Search } from "lucide-react";

export function TopBar({
  title,
  back,
  showSearch = false,
  showBell = true,
}: {
  title?: string;
  back?: string;
  showSearch?: boolean;
  showBell?: boolean;
}) {
  return (
    <header className="flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        {back ? (
          <Link
            to={back}
            className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : null}
        {title ? (
          <h1 className="font-serif text-lg text-ink">{title}</h1>
        ) : (
          <Link to="/" className="font-serif text-xl text-forest">Gather</Link>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showSearch && (
          <button className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-accent">
            <Search className="h-4 w-4" />
          </button>
        )}
        {showBell && (
          <button className="relative grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground/70 hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral ring-2 ring-background" />
          </button>
        )}
      </div>
    </header>
  );
}
