import { useMemo } from 'react'
import { Braces, Layout, Server, Database, Cloud, Bot, Wrench } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import { StaggerGroup, StaggerItem } from './ui/Stagger'

const ICONS = {
  Languages: Braces,
  Frontend: Layout,
  Backend: Server,
  Databases: Database,
  'Cloud & Deployment': Cloud,
  'AI Tools & Agentic Platforms': Bot,
  'Other Tools': Wrench,
}

// Bento spans: the two tag-heaviest categories get more room; everything
// else falls back to a standard tile.
const SPAN = {
  'AI Tools & Agentic Platforms': 'lg:col-span-4',
  'Other Tools': 'lg:col-span-3',
  'Cloud & Deployment': 'lg:col-span-3',
}
const DEFAULT_SPAN = 'lg:col-span-2'

function groupByCategory(skills) {
  const order = []
  const map = new Map()
  for (const s of skills) {
    if (!map.has(s.category)) {
      map.set(s.category, [])
      order.push(s.category)
    }
    map.get(s.category).push(s)
  }
  return order.map((cat) => [cat, map.get(cat)])
}

export default function Skills({ skills }) {
  const groups = useMemo(() => groupByCategory(skills), [skills])

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="container-edge">
        <SectionHeader
          index="02"
          label="Capabilities"
          title="A full-stack toolkit, AI at the core."
          description="Languages and frameworks I build with day to day, grouped by where they live in the stack."
        />

        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6" staggerDelay={0.06}>
          {groups.map(([category, items]) => {
            const Icon = ICONS[category] || Wrench
            const span = SPAN[category] || DEFAULT_SPAN
            return (
              <StaggerItem key={category} className={`sm:col-span-2 ${span}`}>
                <div className="card-glass group h-full p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-void/60 text-primary">
                        <Icon size={16} strokeWidth={1.75} aria-hidden />
                      </span>
                      <h3 className="font-display text-lg font-semibold text-ink">{category}</h3>
                    </div>
                    <span className="font-mono text-xs text-muted">{items.length}</span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <li key={s.id || s.name} className="chip">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
