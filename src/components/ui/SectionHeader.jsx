import Reveal from './Reveal'

export default function SectionHeader({ index, label, title, description }) {
  return (
    <div className="relative mb-14 max-w-2xl md:mb-18">
      <div
        aria-hidden
        className="glow -left-16 -top-16 h-52 w-52 opacity-30"
        style={{ background: 'rgb(var(--c-secondary) / 0.4)' }}
      />
      <div className="relative">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            {index != null && (
              <span className="font-mono text-xs text-muted">/ {index}</span>
            )}
            <span className="mono-label">{label}</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-display-lg font-bold text-ink">
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
          </Reveal>
        )}
      </div>
    </div>
  )
}
