import { motion } from "motion/react";
import { MapCanvas } from "./MapCanvas";
import { Bell, Compass, MapPin, Users } from "lucide-react";

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Phone frame */}
      <div className="relative rounded-[44px] bg-ink p-2.5 shadow-warm-lg">
        <div className="relative overflow-hidden rounded-[34px] bg-background">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-foreground/80">
            <span>9:41</span>
            <span className="h-4 w-16 rounded-full bg-ink/90" />
            <span>···</span>
          </div>

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 pb-3 pt-2">
            <span className="font-serif text-lg text-forest">Gather</span>
            <div className="flex items-center gap-2">
              <div className="relative grid h-7 w-7 place-items-center rounded-full bg-muted">
                <Bell className="h-3.5 w-3.5 text-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-coral ring-2 ring-background" />
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/90 text-[10px] font-semibold text-primary-foreground">
                AM
              </div>
            </div>
          </div>

          {/* Map */}
          <MapCanvas className="h-[220px] w-full" />

          {/* Bottom sheet */}
          <div className="-mt-4 rounded-t-3xl bg-background px-4 pt-3 pb-2">
            <div className="mx-auto h-1 w-10 rounded-full bg-border" />
            <p className="mt-2 text-[11px] font-medium text-muted-foreground">
              This weekend · Eagan
            </p>
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 rounded-2xl bg-card p-3 shadow-warm-sm ring-1 ring-border/60"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-coral/15 px-1.5 py-0.5 text-[9px] font-semibold text-coral">
                  Sunday
                </span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                  Vikings Fans
                </span>
              </div>
              <h4 className="mt-1.5 font-serif text-[15px] text-foreground">
                Vikings vs Packers tailgate
              </h4>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" /> US Bank Stadium · Lot C
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {["JM", "SA", "RT", "KP"].map((a, i) => (
                    <span
                      key={i}
                      className={`grid h-5 w-5 place-items-center rounded-full text-[8px] font-semibold ring-2 ring-card ${
                        ["bg-primary/80 text-primary-foreground", "bg-sage/80 text-white", "bg-coral/80 text-white", "bg-forest/80 text-white"][i]
                      }`}
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <button className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-warm-sm">
                  Count me in
                </button>
              </div>
            </motion.div>

            <div className="mt-2 rounded-2xl bg-card/60 p-3 ring-1 ring-border/40">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-serif text-[14px] text-foreground">Saturday trail run</p>
                  <p className="text-[11px] text-muted-foreground">Lebanon Hills · 8am</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Users className="h-3 w-3" /> 12
                </span>
              </div>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-around border-t border-border bg-background px-2 py-2">
            {[
              { icon: MapPin, label: "Happening", active: true },
              { icon: Users, label: "Communities" },
              { icon: Compass, label: "Explore" },
            ].map(({ icon: Icon, label, active }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[9px] ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mx-auto mb-1.5 mt-0.5 h-1 w-24 rounded-full bg-ink/80" />
        </div>
      </div>
    </div>
  );
}
