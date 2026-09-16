import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export default function PillTabs({ tabs, active, onChange, layoutId, className }) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 rounded-full border border-line bg-panel/60 p-1 backdrop-blur', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            data-cursor="hover"
            className={cn(
              'relative rounded-full px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70',
              isActive ? 'text-void' : 'text-ink-dim hover:text-ink'
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
