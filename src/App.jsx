import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ContentProvider } from './context/ContentContext'
import Home from './components/Home'

// Admin is code-split: public visitors never download the console bundle.
const Admin = lazy(() => import('./admin/Admin'))

export default function App() {
  return (
    <ContentProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Intentionally undiscoverable: no link to this route exists anywhere
            on the public site. Reached only by typing /admin in the URL bar. */}
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <div className="grid min-h-screen place-items-center bg-void">
                  <span className="font-mono text-sm text-muted">…</span>
                </div>
              }
            >
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </ContentProvider>
  )
}
