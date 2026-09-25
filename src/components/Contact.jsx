import { Mail, Phone, Link2 } from 'lucide-react'
import { Github, Linkedin } from './ui/BrandIcons'
import Reveal from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
}

function iconFor(label) {
  const key = (label || '').toLowerCase()
  return ICONS[key] || Link2
}

export default function Contact({ profile, social }) {
  const links = (social || []).filter((s) => s.url)

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow left-1/2 top-1/2 h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/2 animate-mesh-drift" style={{ background: 'rgb(var(--c-secondary) / 0.28)' }} />
        <div className="absolute inset-0 grid-texture opacity-40" style={{ maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent 75%)' }} />
      </div>

      <div className="container-edge relative z-10 text-center">
        <Reveal>
          <p className="mono-label">Contact</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-display-lg font-bold text-ink md:text-display-xl">
            Have something worth <span className="text-primary">building?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
            Open to full-stack and AI engineering work. The fastest way to reach me is email.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {profile?.email && (
              <MagneticButton
                as="a"
                href={`mailto:${profile.email}`}
                className="btn btn-primary"
              >
                <Mail size={15} strokeWidth={2} aria-hidden />
                {profile.email}
              </MagneticButton>
            )}
            {profile?.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Resume ↗
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {profile?.phone && (
              <a href={`tel:${profile.phone}`} className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-ink">
                <Phone size={14} strokeWidth={2} aria-hidden />
                {profile.phone}
              </a>
            )}
            {links.map((s) => {
              const Icon = iconFor(s.label)
              return (
                <a
                  key={s.id || s.label}
                  href={s.url}
                  target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-primary"
                >
                  <Icon size={14} strokeWidth={2} aria-hidden />
                  {s.label}
                </a>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
