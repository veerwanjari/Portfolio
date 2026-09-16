import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { GithubMark } from '@/components/ui/BrandIcons'

export default function ProjectCard({ project, className }) {
  function open() {
    const target = project.demo || project.repo
    if (!target) return
    window.open(target, '_blank', 'noopener,noreferrer')
  }

  function handleCardClick(e) {
    // Let the inner links and any text the reader has selected win.
    if (e.target.closest('a, button')) return
    if (window.getSelection()?.toString()) return
    open()
  }

  function handleKeyDown(e) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }

  return (
    <motion.div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={project.demo || project.repo ? 'link' : undefined}
      tabIndex={project.demo || project.repo ? 0 : undefined}
      aria-label={
        project.demo
          ? `${project.title} — view live site`
          : project.repo
            ? `${project.title} — open repository`
            : undefined
      }
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 0.8, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'frame group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-line/40 p-5 backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-glow pointer-events-auto sm:p-7 md:p-8',
        project.frame === 'accent' && 'frame-accent',
        className
      )}
    >
      <div>
        <div className="mb-4 flex items-center justify-between gap-3 md:mb-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint sm:gap-3">
            {project.featured && (
              <span className="rounded-full border border-accent/40 px-2 py-0.5 text-accent">
                Featured
              </span>
            )}
            <span>{project.year}</span>
          </div>
          {/* Negative margin keeps the 44px tap area without adding visual bulk */}
          <div className="-mr-2 flex items-center">
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              aria-label={`${project.title} on GitHub`}
              className="grid h-11 w-11 place-items-center rounded-full text-ink-faint transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <GithubMark className="h-4 w-4" />
            </a>
          </div>
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug sm:text-2xl md:text-3xl">
          <a
            href={project.demo || project.repo}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            {project.title}
          </a>
        </h3>
        <p className="mt-2 max-w-md text-[0.8125rem] leading-relaxed text-ink-dim sm:text-sm md:text-base">
          {project.tagline}
        </p>
        {project.featured && (
          <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-ink-faint lg:block">
            {project.description}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 md:mt-6">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line bg-void/40 px-2.5 py-1 font-mono text-[10px] text-ink-dim sm:px-3 sm:text-[11px]"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}