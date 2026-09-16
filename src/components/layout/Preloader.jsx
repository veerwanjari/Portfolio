import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export default function Preloader({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(false)
      onDone?.()
      return
    }
    const timer = setTimeout(() => setVisible(false), 650)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-void"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="relative px-6 py-4 font-display text-2xl tracking-wide text-ink"
          >
            <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-accent" />
            <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-accent" />
            <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-accent" />
            <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-accent" />
            Veer Wanjari
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
