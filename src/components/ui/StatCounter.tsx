import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export interface StatCounterProps {
  value: number;
  label: string;
  animate?: boolean;
  className?: string;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function StatCounter({
  value,
  label,
  animate = true,
  className,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate || !inView) return;

    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(easeOut(progress) * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [animate, inView, value]);

  return (
    <motion.div
      ref={ref}
      className={cn("flex flex-col items-center gap-0.5", className)}
    >
      <span className="font-body font-semibold text-xl text-gathr-charcoal">
        {displayed.toLocaleString()}
      </span>
      <span className="text-xs text-gathr-warm-gray tracking-wide uppercase font-body">
        {label}
      </span>
    </motion.div>
  );
}
