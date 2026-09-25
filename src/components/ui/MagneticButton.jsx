import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

// A button/link that subtly leans toward the cursor. Falls back to a plain
// element when reduced motion is requested.
export default function MagneticButton({ as = 'a', className = '', children, ...props }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  const MotionTag = motion[as] || motion.a

  function onMove(e) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const mx = e.clientX - (rect.left + rect.width / 2)
    const my = e.clientY - (rect.top + rect.height / 2)
    x.set(mx * 0.28)
    y.set(my * 0.28)
  }
  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
