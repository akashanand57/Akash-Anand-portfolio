import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { User, Code2, Briefcase, FolderGit2, Mail } from 'lucide-react'

const LINKS = [
  ['About', 'about', User],
  ['Skills', 'skills', Code2],
  ['Work', 'experience', Briefcase],
  ['Projects', 'projects', FolderGit2],
  ['Contact', 'contact', Mail],
]

export default function Nav({ profile }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initials = (profile?.name || 'AA')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')

  return (
    <motion.header
      initial={reduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={`container-edge mt-3 flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 ${
          scrolled
            ? 'border-line bg-surface/80 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Home">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-void font-display text-sm font-bold text-primary">
            {initials}
          </span>
          <span className="hidden font-mono text-xs text-muted sm:block">
            {profile?.name || 'Akash Anand'}
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, id, Icon]) => (
            <a
              key={id}
              href={`#${id}`}
              className="nav-link flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-sm text-muted transition-colors hover:text-ink"
            >
              <Icon size={14} strokeWidth={2} aria-hidden />
              {label}
            </a>
          ))}
        </div>

        <a href="#contact" className="btn btn-primary hidden md:inline-flex">
          Let's talk
        </a>

        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-line md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="container-edge mt-2 md:hidden">
          <div className="card flex flex-col gap-1 p-3">
            {LINKS.map(([label, id, Icon]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-4 py-3 font-mono text-sm text-muted hover:bg-void hover:text-ink"
              >
                <Icon size={15} strokeWidth={2} aria-hidden />
                {label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-1">
              Let's talk
            </a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
