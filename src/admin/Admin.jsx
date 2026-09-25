import { useEffect, useState } from 'react'
import { adminApi, getToken, clearToken } from '../lib/api'
import PasscodeGate from './PasscodeGate'
import Dashboard from './Dashboard'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    document.title = 'Console'
    let active = true
    async function check() {
      if (!getToken()) {
        setChecking(false)
        return
      }
      try {
        await adminApi.verify()
        if (active) setAuthed(true)
      } catch {
        clearToken()
      } finally {
        if (active) setChecking(false)
      }
    }
    check()
    return () => {
      active = false
    }
  }, [])

  function logout() {
    clearToken()
    setAuthed(false)
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-void">
        <span className="font-mono text-sm text-muted">…</span>
      </div>
    )
  }

  return authed ? (
    <Dashboard onLogout={logout} />
  ) : (
    <PasscodeGate onSuccess={() => setAuthed(true)} />
  )
}
