import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import NodeField from './NodeField'
import MagneticButton from './ui/MagneticButton'

const STACK = ['Claude', 'Codex', 'n8n', 'MCP', 'ElevenLabs', 'Nemotron']

// Splits the tagline once, wrapping a short accent phrase (case-insensitive)
// in a highlighted span. Falls back to plain text if the phrase isn't found.
function highlightPhrase(text, phrase) {
  if (!text) return null
  const idx = text.toLowerCase().indexOf(phrase.toLowerCase())
  if (idx === -1) return text
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + phrase.length)
  const after = text.slice(idx + phrase.length)
  return (
    <>
      {before}
      <span className="font-semibold text-primary">{match}</span>
      {after}
    </>
  )
}

export default function Hero({ profile, onResume }) {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)

  // Mouse-tied parallax for the background dot grid — a few px opposite cursor.
  const gx = useMotionValue(0)
  const gy = useMotionValue(0)
  const sgx = useSpring(gx, { stiffness: 40, damping: 20 })
  const sgy = useSpring(gy, { stiffness: 40, damping: 20 })

  function onMouseMove(e) {
    if (reduce || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width - 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5
    gx.set(-relX * 14)
    gy.set(-relY * 14)
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }
  const item = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }
  const word = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }

  const name = profile?.name || 'Akash Anand'
  const role = profile?.role || 'AI-Augmented Full Stack Software Developer'
  const tagline =
    profile?.tagline ||
    'I build real product features at the seam where full-stack engineering meets agentic AI.'
  const nameWords = name.replace(/\.$/, '').split(' ')

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28"
    >
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 grid-texture opacity-60"
          style={{ x: sgx, y: sgy }}
        />
        <div className="glow -left-40 top-0 h-[420px] w-[420px] animate-mesh-drift" style={{ background: 'rgb(var(--c-secondary) / 0.35)' }} />
        <div className="glow right-0 top-40 h-[360px] w-[360px] animate-mesh-drift-slow" style={{ background: 'rgb(var(--c-primary) / 0.18)' }} />
      </div>
      <div className="absolute inset-0 opacity-50">
        <NodeField />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-edge relative z-10"
      >
        <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs text-muted">Available for select engineering work</span>
        </motion.div>

        <motion.p variants={item} className="mono-label mb-5">
          {role}
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl font-display text-display-xl font-bold text-ink"
        >
          {nameWords.map((w, i) => (
            <motion.span key={i} variants={word} className="mr-[0.28em] inline-block">
              {w}
            </motion.span>
          ))}
          <span className="text-ink">.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
          {highlightPhrase(tagline, 'agentic AI')}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
          <MagneticButton as="a" href="#projects" className="btn btn-primary">
            View selected work
            <span aria-hidden>↓</span>
          </MagneticButton>
          <MagneticButton as="a" href="#contact" className="btn btn-ghost">
            Get in touch
          </MagneticButton>
          {profile?.resume_url ? (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              Resume ↗
            </a>
          ) : (
            onResume && (
              <button onClick={onResume} className="btn btn-ghost" type="button">
                Resume
              </button>
            )
          )}
        </motion.div>

        {/* Stack marquee */}
        <motion.div variants={item} className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="font-mono text-label font-medium uppercase text-muted">
            Agentic stack
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {STACK.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
