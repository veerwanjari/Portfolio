import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-void'

export default function MagneticButton({ href, download, onClick, external, variant = 'primary', className, children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 })

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect()
    x.set(((e.clientX - rect.left - rect.width / 2) / rect.width) * 22)
    y.set(((e.clientY - rect.top - rect.height / 2) / rect.height) * 22)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  const classes = cn(
    'relative inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300',
    variant === 'primary' && 'bg-accent text-void hover:bg-accent-soft',
    variant === 'ghost' && 'border border-line text-ink hover:border-accent/60 hover:text-accent',
    FOCUS,
    className
  )

  const shared = {
    ref,
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: reset,
    className: classes,
    'data-cursor': 'hover',
  }

  if (href) {
    return (
      <motion.a href={href} download={download} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {...shared}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" onClick={onClick} {...shared}>
      {children}
    </motion.button>
  )
}
