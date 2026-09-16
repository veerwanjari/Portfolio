import { motion } from "motion/react";
import { MapPin, GraduationCap, Sparkles, Rocket } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";

const EASE = [0.23, 1, 0.32, 1];

const facts = [
  { icon: MapPin, label: "Based in", value: profile.location },
  {
    icon: GraduationCap,
    label: "Studying",
    value: `${profile.education.degree} · ${profile.education.gpa}`,
  },
  {
    icon: Sparkles,
    label: "Focus",
    value: "Full-stack web & applied computer vision",
  },
  {
    icon: Rocket,
    label: "Exploring",
    value: "Agentic AI and autonomous systems",
  },
];

const codeLines = [
  { indent: 0, text: "const veer = {" },
  { indent: 1, text: "role: 'Full-Stack Developer',", accent: true },
  { indent: 1, text: "based: 'Nagpur, India'," },
  { indent: 1, text: "stack: ['React', 'Node.js', 'Python']," },
  { indent: 1, text: "learning: 'agentic AI systems'," },
  { indent: 1, text: "shipsFast: true," },
  { indent: 0, text: "}" },
];

export default function About() {
  return (
    <section
      id="about"
      className="container-px mx-auto max-w-7xl py-20 md:py-32"
    >
      <SectionHeading
        title="Engineering with intent."
        description="A little about how I work and what I'm building toward."
      />

      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="space-y-5 text-[0.9375rem] leading-relaxed text-ink-dim sm:space-y-6 sm:text-lg"
        >
          <p>{profile.summary}</p>
          <p>
            Most of what I've shipped sits at the intersection of the two: a
            computer-vision pipeline that has to reason about the physical world
            in real time, and full-stack platforms that have to feel effortless
            for the people using them. I care about the transition that feels
            right, the state that never teleports, and the interface that gets
            out of the way.
          </p>

          <dl className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 sm:gap-5 sm:pt-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-panel text-accent">
                  <fact.icon className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-xs text-ink-faint">{fact.label}</dt>
                  <dd className="text-sm text-ink">{fact.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 0.8, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="frame frame-accent overflow-hidden rounded-2xl shadow-glow backdrop-blur"
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-3 sm:px-5 sm:py-4">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-ink-faint">
              about.js
            </span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[0.75rem] leading-6 sm:p-6 sm:text-sm sm:leading-7">
            {codeLines.map((line, i) => (
              <div key={i} style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
                <span className={line.accent ? "text-accent" : "text-ink-dim"}>
                  {line.text}
                </span>
              </div>
            ))}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
