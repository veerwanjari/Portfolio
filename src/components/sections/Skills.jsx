import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code2, Layers, Server, Cloud, Binary, Wrench } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";

const ICONS = { Code2, Layers, Server, Cloud, Binary, Wrench };
const EASE = [0.23, 1, 0.32, 1];

export default function Skills() {
  const [active, setActive] = useState(skillCategories[0].id);
  const category = skillCategories.find((c) => c.id === active);
  const Icon = ICONS[category.icon];

  return (
    <section
      id="skills"
      className="container-px mx-auto max-w-7xl py-20 md:py-32"
    >
      <SectionHeading
        title="A toolkit built for shipping."
        description="From production AI pipelines to pixel-perfect interfaces — the stack I reach for."
      />

      {/* Same pill treatment as the top navbar. Six categories overflow a
          phone, so the row scrolls sideways instead of stretching the page. */}
      <div className="tab-scroller mb-8 md:mb-10">
        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-1 rounded-full border border-line/40 px-1.5 py-1.5 backdrop-blur"
        >
          {skillCategories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <li key={cat.id} className="relative shrink-0">
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    "relative z-10 whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
                    isActive ? "text-void" : "text-ink-dim hover:text-ink",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="skills-nav-highlight"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.15,
                      }}
                    />
                  )}
                  {cat.label}
                </button>
              </li>
            );
          })}
        </motion.ul>
      </div>

      {/* Back to original .frame box styling */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 0.8, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className="frame relative min-h-[150px] overflow-hidden rounded-[1.75rem] p-6 backdrop-blur sm:rounded-[2.5rem] sm:p-8 md:p-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="mb-6 flex items-center gap-3 text-accent md:mb-8">
              <Icon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
              <span className="font-display text-lg text-ink md:text-xl">
                {category.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {category.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * i, ease: EASE }}
                  className="rounded-full border border-line bg-void/40 px-3.5 py-2 font-mono text-[0.8125rem] text-ink backdrop-blur-sm transition-colors duration-300 hover:border-accent/50 hover:text-accent sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
