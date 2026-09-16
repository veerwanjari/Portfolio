import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import ProjectCard from './ProjectCard'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import { GithubMark } from '@/components/ui/BrandIcons'

// The bento arrangement only exists at large sizes. Below that it collapses to
// two columns and then one, so nothing is squeezed into a 15rem row on a phone.
const SPANS = [
  'sm:col-span-2 lg:col-span-4 lg:row-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'sm:col-span-2 lg:col-span-3',
]

export default function Projects() {
  return (
    <section id="work" className="container-px mx-auto max-w-7xl py-20 md:py-32">
      <SectionHeading
        title="Things I've built."
        description="A few projects that pushed me to learn something new — from real-time computer vision to full-stack platforms."
        aside={
          <p className="text-sm text-ink-faint">
            {projects.length} shipped, all on GitHub
          </p>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:auto-rows-[minmax(15rem,auto)] lg:grid-cols-6">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            className={SPANS[i] ?? 'lg:col-span-3'}
          />
        ))}

        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="frame group relative z-20 flex items-center justify-between gap-4 rounded-2xl bg-panel/40 px-5 py-5 pointer-events-auto backdrop-blur transition-[border-color] duration-300 sm:col-span-2 sm:px-8 sm:py-6 lg:col-span-3"
        >
          <span className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-panel text-accent">
              <GithubMark className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-base sm:text-lg">
                More on GitHub
              </span>
              <span className="block text-[0.8125rem] text-ink-dim sm:text-sm">
                The rest of my repositories &amp; experiments
              </span>
            </span>
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-dim transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
        </a>
      </div>
    </section>
  )
}
