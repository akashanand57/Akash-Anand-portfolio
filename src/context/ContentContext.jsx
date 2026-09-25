import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchAllContent } from '../lib/api'
import { FALLBACK } from '../lib/fallback'
import { applyTheme } from '../lib/theme'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const data = await fetchAllContent()
      // Merge over fallback so a partially-empty DB never blanks the page.
      const merged = {
        profile: data.profile || FALLBACK.profile,
        social: data.social.length ? data.social : FALLBACK.social,
        skills: data.skills.length ? data.skills : FALLBACK.skills,
        experiences: data.experiences.length ? data.experiences : FALLBACK.experiences,
        projects: data.projects.length ? data.projects : FALLBACK.projects,
        certifications: data.certifications.length ? data.certifications : FALLBACK.certifications,
        education: data.education.length ? data.education : FALLBACK.education,
        theme: data.theme || FALLBACK.theme,
      }
      setContent(merged)
      applyTheme(merged.theme)
    } catch (e) {
      console.warn('[portfolio] falling back to seed content:', e.message)
      applyTheme(FALLBACK.theme)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <ContentContext.Provider value={{ content, loading, reload: load }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
