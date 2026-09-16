import { ArrowUp, Code2 } from 'lucide-react'
import { profile } from '@/data/profile'
import { scrollToId } from '@/lib/utils'
import { GithubMark, LinkedinMark } from '@/components/ui/BrandIcons'

const SOCIALS = [
  { href: profile.github, label: 'GitHub', Icon: GithubMark },
  { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedinMark },
  { href: profile.leetcode, label: 'LeetCode', Icon: Code2 },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t border-line"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="container-px mx-auto flex max-w-7xl flex-col items-center gap-5 py-8 text-sm text-ink-dim md:flex-row md:justify-between md:gap-6 md:py-10">
        <p className="order-3 md:order-1">{year} Veer Wanjari</p>

        {/* Icons sit in 44px boxes so they are tappable, with the row pulled
            back in by the same amount to keep the visual spacing tight. */}
        <div className="order-1 -mx-2 flex items-center md:order-2">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              aria-label={label}
              className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <button
          type="button"
          data-cursor="hover"
          onClick={() => scrollToId('top')}
          className="order-2 flex min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-xs transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 md:order-3"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  )
}
