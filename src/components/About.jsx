import { Rocket, Layers, GraduationCap, Sparkles } from 'lucide-react'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'
import { StaggerGroup, StaggerItem } from './ui/Stagger'
import CountUp from './ui/CountUp'

const STATS = [
  { icon: Rocket, value: 3, suffix: '+', label: 'Roles shipped' },
  { icon: Layers, value: 6, suffix: '', label: 'Live products' },
  { icon: GraduationCap, value: null, display: 'B.Tech', label: 'CSE, 2024' },
  { icon: Sparkles, value: null, display: 'AI-first', label: 'Workflow' },
]

// Splits the resume summary into a bold lead sentence + supporting sentence,
// so it reads as a designed statement instead of one flat paragraph.
function splitSummary(text) {
  if (!text) return { lead: '', rest: '' }
  const idx = text.indexOf('. ')
  if (idx === -1) return { lead: text, rest: '' }
  return { lead: text.slice(0, idx + 1), rest: text.slice(idx + 2) }
}

// Within the supporting sentence, highlights a "(Tool, Tool, Tool)" list by
// accent-coloring each name individually instead of leaving it as plain prose.
function highlightTools(text) {
  const match = text.match(/^(.*?)\(([^)]+)\)(.*)$/s)
  if (!match) return text
  const [, before, inside, after] = match
  const tools = inside.split(',').map((s) => s.trim()).filter(Boolean)
  return (
    <>
      {before}(
      {tools.map((t, i) => (
        <span key={t}>
          <span className="font-medium text-primary">{t}</span>
          {i < tools.length - 1 ? ', ' : ''}
        </span>
      ))}
      ){after}
    </>
  )
}

export default function About({ profile }) {
  const { lead, rest } = splitSummary(profile?.summary)

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container-edge">
        <SectionHeader index="01" label="About" title="Engineering, augmented." />

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <Reveal>
            <div className="relative border-l-2 border-primary/30 pl-6">
              <p className="font-display text-xl font-medium leading-snug text-ink md:text-2xl">
                {lead}
              </p>
              {rest && (
                <p className="mt-4 text-base leading-relaxed text-ink/70">
                  {highlightTools(rest)}
                </p>
              )}
            </div>
            <p className="mt-8 text-base leading-relaxed text-muted">
              I work where product engineering meets agentic AI — designing features
              that lean on <span className="text-ink/90">Claude</span>,{' '}
              <span className="text-ink/90">Codex</span>,{' '}
              <span className="text-ink/90">n8n</span> and the{' '}
              <span className="text-ink/90">Model Context Protocol</span> to do real
              work: chat + voice advisors, market-intelligence briefs, automated
              editorial and growth pipelines. The stack is full-stack; the leverage is AI.
            </p>
          </Reveal>

          <StaggerGroup className="grid grid-cols-2 gap-3" staggerDelay={0.07}>
            {STATS.map(({ icon: Icon, value, suffix, display, label }) => (
              <StaggerItem key={label} className="card-glass p-5">
                <Icon size={18} strokeWidth={1.75} className="mb-3 text-primary" aria-hidden />
                <div className="font-display text-3xl font-semibold text-ink">
                  {value != null ? <CountUp value={value} suffix={suffix} /> : display}
                </div>
                <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                  {label}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
