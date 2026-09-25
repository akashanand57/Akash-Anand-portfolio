import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Github } from './ui/BrandIcons'
import SectionHeader from './ui/SectionHeader'
import { StaggerGroup, StaggerItem } from './ui/Stagger'

function hostFrom(url) {
  try {
    return new URL(url).host.replace('www.', '')
  } catch {
    return null
  }
}

function ProjectCard({ project, featured }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false })

  function onMove(e) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    })
  }

  const host = hostFrom(project.live_url)
  const number = String((project._index ?? 0) + 1).padStart(2, '0')

  const inner = (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
      className={`card-glass relative h-full overflow-hidden p-7 ${featured ? 'md:p-9' : ''}`}
    >
      {/* cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(500px circle at ${spot.x}% ${spot.y}%, rgb(var(--c-primary) / 0.10), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-6 flex items-start justify-between">
          <span className="font-mono text-xs text-muted">{number}</span>
          {project.live_url && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live
            </span>
          )}
        </div>

        <h3
          className={`font-display font-semibold text-ink transition-colors group-hover:text-primary ${
            featured ? 'text-xl' : 'text-lg'
          }`}
        >
          {project.title}
        </h3>

        <p className={`mt-3 text-sm leading-relaxed text-muted ${featured ? 'md:text-base' : ''}`}>
          {project.description}
        </p>

        {Array.isArray(project.tech) && project.tech.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 pt-6">
          {project.live_url ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-sm text-ink transition-colors group-hover:text-primary">
              <ExternalLink size={14} strokeWidth={2} aria-hidden />
              {host || 'Visit'}
            </span>
          ) : (
            <span className="text-sm text-muted">Case study on request</span>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-ink"
              aria-label={`${project.title} repository`}
            >
              <Github size={14} />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return project.live_url ? (
    <motion.a
      href={project.live_url}
      target="_blank"
      rel="noreferrer"
      whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group block h-full"
      aria-label={`${project.title} — open live site`}
    >
      {inner}
    </motion.a>
  ) : (
    <div className="group block h-full">{inner}</div>
  )
}

export default function Projects({ projects }) {
  const indexed = projects.map((p, i) => ({ ...p, _index: i }))
  const featured = indexed.filter((p) => p.featured)
  const rest = indexed.filter((p) => !p.featured)

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="container-edge">
        <SectionHeader
          index="04"
          label="Selected work"
          title="Products shipped, not slideware."
          description="A sample of live platforms — AI advisors, trading intelligence, real-estate discovery — built end to end."
        />

        {featured.length > 0 && (
          <StaggerGroup className="grid gap-4 md:grid-cols-3" staggerDelay={0.08}>
            {featured.map((p, i) => (
              <StaggerItem key={p.id || i} className="h-full">
                <ProjectCard project={p} featured />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        {rest.length > 0 && (
          <StaggerGroup className="mt-4 grid gap-4 md:grid-cols-3" staggerDelay={0.06}>
            {rest.map((p, i) => (
              <StaggerItem key={p.id || i} className="h-full">
                <ProjectCard project={p} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  )
}
