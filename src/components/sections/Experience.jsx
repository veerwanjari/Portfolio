import { useState } from "react";
import { motion } from "motion/react";
import { Briefcase, GraduationCap, Trophy } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { timeline } from "@/data/timeline";
import { cn } from "@/lib/utils";

const ICONS = {
  experience: Briefcase,
  education: GraduationCap,
  achievement: Trophy,
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "achievement", label: "Achievements" },
];

const EASE = [0.23, 1, 0.32, 1];

export default function Experience() {
  const [filter, setFilter] = useState("all");
  const items =
    filter === "all" ? timeline : timeline.filter((t) => t.type === filter);

  return (
    <section
      id="journey"
      className="container-px mx-auto max-w-7xl py-20 md:py-32"
    >
      <SectionHeading
        title="How I got here."
        description="Internships, milestones, and the education behind the work."
      />

      {/* Filter tabs. The row scrolls sideways rather than wrapping, so it
          keeps its pill shape on a narrow screen. */}
      <div className="tab-scroller mb-10 md:mb-14">
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-1 rounded-full border border-line/40 px-1.5 py-1.5 backdrop-blur-md shadow-lg"
        >
          {FILTERS.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <li key={tab.id} className="relative shrink-0">
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "relative z-10 whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                    isActive ? "text-void" : "text-ink-dim hover:text-ink",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="journey-nav-highlight"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.15,
                      }}
                    />
                  )}
                  {tab.label}
                </button>
              </li>
            );
          })}
        </motion.ul>
      </div>

      {/* Vertical Timeline Stack with Transparent Project Card Style */}
      <div className="relative pl-6 sm:pl-8 md:pl-10">
        <div className="absolute bottom-2 left-[6px] top-2 w-px bg-line sm:left-[7px] md:left-[11px]" />

        <div className="space-y-4 sm:space-y-6">
          {items.map((entry, i) => {
            const Icon = ICONS[entry.type];
            return (
              <div key={entry.id} className="relative">
                {/* Timeline Icon Marker */}
                <span className="absolute -left-6 top-6 z-25 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-void bg-accent sm:-left-8 sm:h-4 sm:w-4 md:-left-10 md:top-7 md:h-5 md:w-5">
                  <Icon className="hidden h-2.5 w-2.5 text-void md:block" />
                </span>

                {/* Card Container: Backdrop blur will now catch the canvas properly */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 0.8, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(i, 4) * 0.05,
                    ease: EASE,
                  }}
                  className={cn(
                    "frame group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line/40 p-5 backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-glow pointer-events-auto sm:p-7 md:p-8",
                    entry.frame === "accent" && "frame-accent",
                  )}
                >
                  <div>
                    {/* Header: Year & Type Badge */}
                    <div className="mb-4 flex items-center justify-between md:mb-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint sm:gap-3">
                        <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-accent">
                          {entry.year}
                        </span>
                        <span className="capitalize">{entry.type}</span>
                      </div>
                    </div>

                    {/* Title & Organization */}
                    <h3 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-accent sm:text-xl md:text-2xl">
                      {entry.title}
                    </h3>
                    {entry.org && (
                      <p className="mt-1 text-[0.8125rem] font-medium text-ink-dim sm:text-sm md:text-base">
                        {entry.org}
                      </p>
                    )}

                    {/* Bullet Points */}
                    {entry.points && (
                      <ul className="mt-4 space-y-2 text-[0.8125rem] text-ink-dim sm:text-sm">
                        {entry.points.map((p, j) => (
                          <li key={j} className="flex gap-2.5 items-start">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
