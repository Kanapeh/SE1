"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DashboardHeroHighlight = {
  label: string;
  value: ReactNode;
  description?: string;
};

type DashboardHeroProps = {
  title: string;
  subtitle: string;
  badge?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  highlights?: DashboardHeroHighlight[];
  className?: string;
};

export default function DashboardHero({
  title,
  subtitle,
  badge,
  primaryAction,
  secondaryAction,
  highlights,
  className,
}: DashboardHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur",
        "dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-[0_20px_60px_rgba(15,23,42,0.45)]",
        className,
      )}
    >
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-200/70 via-purple-200/70 to-cyan-200/50 blur-3xl dark:from-blue-500/30 dark:via-purple-500/30 dark:to-cyan-500/20" />
        <div className="absolute bottom-0 right-[-12rem] h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200/70 via-sky-200/60 to-emerald-200/60 blur-3xl dark:from-indigo-500/25 dark:via-sky-500/25 dark:to-emerald-500/20" />
      </div>

      <div className="relative z-10 flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-10 lg:p-12">
        <div className="flex-1 space-y-5">
          {badge ? <div className="inline-flex items-center">{badge}</div> : null}
          <div className="space-y-3">
            <h1 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-[40px] lg:leading-[1.15] dark:text-white">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
              {subtitle}
            </p>
          </div>
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {primaryAction}
              {secondaryAction}
            </div>
          )}
        </div>

        {highlights && highlights.length > 0 && (
          <div
            className="grid w-full max-w-sm grid-cols-1 gap-4 rounded-2xl bg-slate-50/80 p-5 dark:bg-slate-800/70 sm:grid-cols-2 lg:grid-cols-1"
            role="presentation"
          >
            {highlights.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/60 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                {item.description ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

