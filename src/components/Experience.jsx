import SectionHeader from './ui/SectionHeader'
import { StaggerGroup, StaggerItem } from './ui/Stagger'

export default function Experience({ experiences }) {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="container-edge">
        <SectionHeader
          index="03"
          label="Experience"
          title="Where I've been building."
        />

        <div className="relative">
          {/* timeline spine */}
          <div
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-line to-transparent md:left-[9px]"
          />

          <StaggerGroup className="space-y-10" staggerDelay={0.08}>
            {experiences.map((exp, i) => (
              <StaggerItem key={exp.id || i} className="relative pl-8 md:pl-12">
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-primary/60 bg-void md:h-5 md:w-5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>

                <div className="card-glass p-6 md:p-7">
                  <div className="flex flex-col justify-between gap-1 md:flex-row md:items-baseline">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {exp.role}
                      <span className="text-primary"> · {exp.company}</span>
                    </h3>
                    <span className="font-mono text-xs text-muted">{exp.period}</span>
                  </div>

                  {exp.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{exp.summary}</p>
                  )}

                  {Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="flex gap-3 text-sm text-ink/85">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {Array.isArray(exp.tags) && exp.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {exp.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
