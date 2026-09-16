import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const EASE = [0.23, 1, 0.32, 1]

export default function SectionHeading({ title, description, aside, align = 'left', className }) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4 md:mb-20 md:gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-balance font-display text-[1.75rem] font-semibold leading-[1.12] sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            className="mt-3 max-w-prose text-[0.9375rem] text-ink-dim sm:mt-4 sm:text-base"
          >
            {description}
          </motion.p>
        )}
      </div>
      {aside && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
        >
          {aside}
        </motion.div>
      )}
    </div>
  )
}
