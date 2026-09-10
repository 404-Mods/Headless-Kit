"use client";

/**
 * Headless Kit — Copyright (c) 2026 404 Development.
 * Licensed under the Headless Kit Licence; see LICENSE at the project root.
 * Deployments must retain the "Powered by 404 Development" credit (condition 2).
 */
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";

interface SaleCountdownProps {
  expirationDate: string;
  /** "card" = compact inline, "panel" = full bar in purchase panel */
  variant?: "card" | "panel";
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return { d, h, m, s };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function SaleCountdown({ expirationDate, variant = "panel" }: SaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(expirationDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(expirationDate));
    }, 1000);
    return () => clearInterval(id);
  }, [expirationDate]);

  if (!timeLeft) return null;

  if (variant === "card") {
    return (
      <div className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-sm">
        <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3 shrink-0" />
        {timeLeft.d > 0
          ? `${timeLeft.d}d ${pad(timeLeft.h)}h left`
          : `${pad(timeLeft.h)}:${pad(timeLeft.m)}:${pad(timeLeft.s)}`}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
      <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 shrink-0 text-amber-400" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/70">Sale ends in</p>
        <p className="text-sm font-black tabular-nums text-amber-300">
          {timeLeft.d > 0 && <span>{timeLeft.d}d </span>}
          {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
        </p>
      </div>
      {/* Animated pulse dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
      </span>
    </div>
  );
}
