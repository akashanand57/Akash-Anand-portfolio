import { useContent } from '../context/ContentContext'
import CustomCursor from './CustomCursor'
import Nav from './Nav'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Credentials from './Credentials'
import Contact from './Contact'
import Footer from './Footer'

export default function Home() {
  const { content } = useContent()
  const {
    profile,
    social,
    skills,
    experiences,
    projects,
    certifications,
    education,
  } = content

  return (
    <div className="relative">
      <div className="noise-overlay" aria-hidden="true" />
      <CustomCursor />

      {/* Skip link for keyboard users */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-void"
      >
        Skip to content
      </a>

      <Nav profile={profile} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Credentials certifications={certifications} education={education} />
        <Contact profile={profile} social={social} />
      </main>
      <Footer profile={profile} />
    </div>
  )
}
