import { useState } from "react";
import { Copy, Check, Code2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import { profile } from "@/data/profile";
import { copyToClipboard } from "@/lib/utils";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandIcons";
import { motion } from "motion/react";

const LINKS = [
  {
    label: "GitHub",
    href: profile.github,
    Icon: GithubMark,
    handle: "@veerwanjari",
  },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    Icon: LinkedinMark,
    handle: "veer-wanjari",
  },
  {
    label: "LeetCode",
    href: profile.leetcode,
    Icon: Code2,
    handle: "@veerwanjari",
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(profile.email);
    if (ok) {
      setCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error(`Copy failed — reach me at ${profile.email}`);
    }
  }

  return (
    <section
      id="contact"
      className="container-px mx-auto max-w-7xl py-20 md:py-36"
    >
      <SectionHeading
        title="Let's build something great."
        description="Open to full-stack and AI engineering roles, internships, and interesting collaborations."
        align="center"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <button
          type="button"
          onClick={handleCopy}
          data-cursor="hover"
          className="group flex w-full flex-wrap items-center justify-center gap-3 rounded font-display text-[1.375rem] font-medium leading-tight text-ink transition-colors [overflow-wrap:anywhere] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:text-3xl md:text-4xl"
        >
          {profile.email}
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-dim transition-colors group-hover:border-accent/50 group-hover:text-accent">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </span>
        </button>

        <MagneticButton
          href={`mailto:${profile.email}`}
          variant="primary"
          className="mt-2 justify-center border border-accent/60 bg-accent/65 py-3.5 text-ink backdrop-blur hover:bg-accent/55 sm:mt-4 sm:py-3"
        >
          Say hello <ArrowUpRight className="h-3.5 w-3.5" />
        </MagneticButton>

        <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
          {LINKS.map(({ label, href, Icon, handle }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 0.8, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="frame group flex min-h-[64px] items-center justify-between gap-3 rounded-[1.5rem] px-5 py-4 backdrop-blur-md transition-[border-color] duration-300 sm:rounded-[2rem] sm:px-6 sm:py-5"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-left">
                  <span className="block text-xs text-ink-faint">{label}</span>
                  <span className="block text-sm text-ink">{handle}</span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
