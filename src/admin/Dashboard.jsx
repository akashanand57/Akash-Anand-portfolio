import { useState, useCallback } from 'react'
import { useContent } from '../context/ContentContext'
import ResourcePanel from './panels/ResourcePanel'
import ProfilePanel from './panels/ProfilePanel'
import ThemePanel from './panels/ThemePanel'
import ResumePanel from './panels/ResumePanel'
import SecurityPanel from './panels/SecurityPanel'

const NAV = [
  { id: 'profile', label: 'Profile' },
  { id: 'skills', label: 'Skills', resource: 'skills' },
  { id: 'experiences', label: 'Experience', resource: 'experiences' },
  { id: 'projects', label: 'Projects', resource: 'projects' },
  { id: 'certifications', label: 'Certifications', resource: 'certifications' },
  { id: 'education', label: 'Education', resource: 'education' },
  { id: 'social_links', label: 'Contact links', resource: 'social_links' },
  { id: 'resume', label: 'Resume' },
  { id: 'theme', label: 'Theme' },
  { id: 'security', label: 'Security' },
]

export default function Dashboard({ onLogout }) {
  const { content, reload } = useContent()
  const [active, setActive] = useState('profile')
  const [toast, setToast] = useState(null)

  const notify = useCallback((msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const contentByResource = {
    skills: content.skills,
    experiences: content.experiences,
    projects: content.projects,
    certifications: content.certifications,
    education: content.education,
    social_links: content.social,
  }

  const activeNav = NAV.find((n) => n.id === active)

  function renderPanel() {
    if (activeNav?.resource) {
      return (
        <ResourcePanel
          key={activeNav.resource}
          resourceKey={activeNav.resource}
          items={contentByResource[activeNav.resource] || []}
          reload={reload}
          notify={notify}
        />
      )
    }
    switch (active) {
      case 'profile':
        return <ProfilePanel profile={content.profile} reload={reload} notify={notify} />
      case 'resume':
        return <ResumePanel profile={content.profile} reload={reload} notify={notify} />
      case 'theme':
        return <ThemePanel theme={content.theme} reload={reload} notify={notify} />
      case 'security':
        return <SecurityPanel notify={notify} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-void">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-line font-display text-sm font-bold text-primary">
              ●
            </span>
            <span className="font-mono text-xs text-muted">Content console</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="font-mono text-xs text-muted hover:text-ink">
              View site ↗
            </a>
            <button onClick={onLogout} className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-ink hover:border-primary/60">
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:flex-row">
        {/* Sidebar */}
        <nav className="flex shrink-0 flex-row flex-wrap gap-1 md:w-52 md:flex-col">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`rounded-lg px-3 py-2 text-left font-mono text-sm transition-colors ${
                active === n.id
                  ? 'bg-surface text-primary'
                  : 'text-muted hover:bg-surface/60 hover:text-ink'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <main className="min-w-0 flex-1">{renderPanel()}</main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border px-5 py-2.5 font-mono text-sm backdrop-blur-xl ${
            toast.type === 'error'
              ? 'border-accent/50 bg-surface/90 text-accent'
              : 'border-primary/50 bg-surface/90 text-primary'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
