"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  accent?: "blue" | "green" | "purple" | "orange" | "slate";
  layout?: "horizontal" | "vertical";
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
};

const accentStyles: Record<
  NonNullable<DashboardStatCardProps["accent"]>,
  { bg: string; border: string; icon: string }
> = {
  blue: {
    bg: "from-sky-500/12 via-indigo-500/10 to-sky-500/12 dark:from-sky-500/15 dark:via-indigo-500/15 dark:to-sky-500/15",
    border: "border-sky-200/70 dark:border-sky-500/30",
    icon: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  },
  green: {
    bg: "from-emerald-500/12 via-teal-500/10 to-emerald-500/12 dark:from-emerald-500/15 dark:via-teal-500/15 dark:to-emerald-500/15",
    border: "border-emerald-200/70 dark:border-emerald-500/30",
    icon: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  },
  purple: {
    bg: "from-purple-500/12 via-fuchsia-500/10 to-purple-500/12 dark:from-purple-500/15 dark:via-fuchsia-500/15 dark:to-purple-500/15",
    border: "border-purple-200/70 dark:border-purple-500/30",
    icon: "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white",
  },
  orange: {
    bg: "from-amber-500/12 via-orange-500/10 to-amber-500/12 dark:from-amber-500/15 dark:via-orange-500/15 dark:to-amber-500/15",
    border: "border-amber-200/70 dark:border-amber-500/30",
    icon: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  },
  slate: {
    bg: "from-slate-500/12 via-slate-500/10 to-slate-500/12 dark:from-slate-500/15 dark:via-slate-500/15 dark:to-slate-500/15",
    border: "border-slate-200/70 dark:border-slate-500/30",
    icon: "bg-gradient-to-br from-slate-500 to-slate-700 text-white",
  },
};

export default function DashboardStatCard({
  title,
  value,
  description,
  icon,
  accent = "slate",
  layout = "vertical",
  footer,
  onClick,
  className,
}: DashboardStatCardProps) {
  const accentStyle = accentStyles[accent];

  return (
    <button
      type={onClick ? "button" : "button"}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white/90 p-5 text-right shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:bg-slate-900/80",
        accentStyle.border,
        onClick ? "focus-visible:ring-2 focus-visible:ring-offset-2" : "cursor-default",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          accentStyle.bg,
        )}
        aria-hidden="true"
      />

      <div className={cn("relative z-10", layout === "horizontal" ? "flex items-center justify-between gap-4" : "space-y-4")}>
        <div className={cn("flex items-start gap-4", layout === "horizontal" ? "flex-row-reverse" : "flex-col items-start")}>
          <div className={cn("rounded-xl p-3 shadow-inner", accentStyle.icon)} aria-hidden="true">
            {icon}
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">{title}</p>
            <div className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{value}</div>
            {description ? (
              <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">{description}</p>
            ) : null}
          </div>
        </div>
        {footer ? <div className="text-xs text-slate-500 dark:text-slate-400">{footer}</div> : null}
      </div>
    </button>
  );
}

