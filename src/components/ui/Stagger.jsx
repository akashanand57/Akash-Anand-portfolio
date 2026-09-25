import { motion, useReducedMotion } from 'framer-motion'

// Container/item pair for scroll-triggered staggered reveals.
// StaggerGroup fires once when it enters the viewport; each StaggerItem
// fades up in sequence (staggerDelay apart).
export function StaggerGroup({ children, className = '', staggerDelay = 0.06, once = true }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: staggerDelay, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', y = 20 }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
