import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowDownToLine, ArrowRight } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import { profile } from '@/data/profile'
import { useGithubStats } from '@/hooks'
import { scrollToId } from '@/lib/utils'

const EASE = [0.23, 1, 0.32, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function Hero({ ready }) {
  const stats = useGithubStats('veerwanjari')
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id
    const start = () => {
      id = setInterval(
        () => setRoleIndex((i) => (i + 1) % profile.roles.length),
        2800
      )
    }
    const stop = () => clearInterval(id)
    // No point cycling text nobody is looking at.
    const onVisibility = () => (document.hidden ? stop() : start())

    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const statCells = [
    { value: String(stats.public_repos), label: 'Public repos' },
    { value: String(stats.followers), label: 'Followers' },
    ...profile.stats.slice(0, 2),
  ]

  return (
    <section
      id="top"
      className="hero-section relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-20 pt-28 md:pb-24 md:pt-36"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
        className="container-px relative mx-auto w-full max-w-7xl"
      >
        <motion.p
          variants={item}
          className="mb-5 flex items-center gap-2 text-[0.8125rem] text-ink-dim sm:text-sm"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          Open to full-stack &amp; AI engineering roles
        </motion.p>

        <motion.h1
          variants={item}
          className="hero-title font-hero font-bold leading-[0.98] tracking-tight"
        >
          <span className="hero-outline">V</span>
          <span className="text-ink">ee</span>
          <span className="hero-outline">r</span>
          <span> </span>
          <span className="hero-outline">W</span>
          <span className="text-ink">anj</span>
          <span className="hero-outline">ar</span>
          <span className="text-ink">i</span>
        </motion.h1>

        {/* A fixed line box keeps the paragraph below from jumping each time
            the role swaps. */}
        <motion.div
          variants={item}
          className="mt-5 flex min-h-[2.75rem] flex-wrap items-center font-display text-xl text-ink-dim sm:min-h-[3.25rem] sm:text-3xl md:min-h-[4rem] md:text-4xl"
        >
          <span className="mr-1 text-ink">I build</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="role-frame text-ink"
            >
              {profile.roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-balance text-[0.9375rem] leading-relaxed text-ink-dim sm:mt-8 sm:text-lg"
        >
          {profile.summary}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <MagneticButton
            onClick={() => scrollToId('work')}
            variant="primary"
            className="justify-center border border-accent/60 bg-accent/65 py-3.5 text-ink backdrop-blur hover:bg-accent/55 sm:py-3"
          >
            Explore work <ArrowRight className="h-3.5 w-3.5" />
          </MagneticButton>
          <MagneticButton
            href={profile.resumeUrl}
            download
            variant="ghost"
            className="justify-center py-3.5 sm:py-3"
          >
            Download résumé <ArrowDownToLine className="h-3.5 w-3.5" />
          </MagneticButton>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:flex sm:flex-wrap sm:gap-4"
        >
          {statCells.map((cell) => (
            <div key={cell.label} className="frame rounded-lg px-4 py-3">
              <p className="font-mono text-lg text-ink sm:text-xl">{cell.value}</p>
              <p className="mt-0.5 text-xs text-ink-faint">{cell.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Hidden on phones, where the fold is tight and the cue would collide
          with the stat grid. */}
      <motion.button
        type="button"
        onClick={() => scrollToId('about')}
        data-cursor="hover"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 0.75, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-faint transition-colors hover:text-ink focus-visible:outline-none md:flex"
        aria-label="Scroll to About section"
      >
      </motion.button>
    </section>
  )
}
