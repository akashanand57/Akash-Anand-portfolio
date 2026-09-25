import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

export default function Credentials({ certifications, education }) {
  return (
    <section id="credentials" className="relative py-24 md:py-32">
      <div className="container-edge">
        <SectionHeader index="05" label="Credentials" title="Education & certifications." />

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="mb-5 font-mono text-label font-medium uppercase text-muted">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((ed, i) => (
                <Reveal key={ed.id || i} delay={i * 0.05}>
                  <div className="card-glass p-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="font-display text-lg font-semibold text-ink">{ed.degree}</h4>
                      {ed.score && (
                        <span className="shrink-0 font-mono text-sm text-primary">{ed.score}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{ed.institution}</p>
                    <p className="mt-2 font-mono text-xs text-muted">
                      {[ed.location, ed.period].filter(Boolean).join('  ·  ')}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-mono text-label font-medium uppercase text-muted">
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((c, i) => (
                <Reveal key={c.id || i} delay={i * 0.05}>
                  <div className="card flex items-center justify-between gap-4 p-6">
                    <div>
                      <h4 className="font-display text-lg font-semibold text-ink">{c.title}</h4>
                      <p className="mt-1 text-sm text-muted">{c.issuer}</p>
                    </div>
                    {c.year && (
                      <span className="shrink-0 font-mono text-sm text-muted">{c.year}</span>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
