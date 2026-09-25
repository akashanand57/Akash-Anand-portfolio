export default function Footer({ profile }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line py-10">
      <div className="container-edge flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-xs text-muted">
          © {year} {profile?.name || 'Akash Anand'}. Built with React, Tailwind & Supabase.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Designed & engineered end to end
        </div>
      </div>
    </footer>
  )
}
