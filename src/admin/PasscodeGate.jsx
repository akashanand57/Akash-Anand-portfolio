import { useState } from 'react'
import { adminApi, setToken } from '../lib/api'

// Deliberately minimal and generic. No branding, no hint that this is a
// portfolio admin, no reference to site structure. Wrong passcode → flat error.
export default function PasscodeGate({ onSuccess }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { token } = await adminApi.login(passcode)
      setToken(token)
      onSuccess()
    } catch (err) {
      // Never surface anything specific.
      setError('Incorrect passcode.')
      setPasscode('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-void px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="card p-8">
          <label htmlFor="passcode" className="mono-label">
            Passcode
          </label>
          <input
            id="passcode"
            type="password"
            autoFocus
            autoComplete="off"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="mt-3 w-full rounded-lg border border-line bg-void px-4 py-3 font-mono text-ink outline-none focus:border-primary/60"
            aria-invalid={!!error}
          />
          {error && (
            <p role="alert" className="mt-3 font-mono text-xs text-accent">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !passcode}
            className="btn btn-primary mt-5 w-full disabled:opacity-50"
          >
            {busy ? 'Checking…' : 'Enter'}
          </button>
        </div>
      </form>
    </div>
  )
}
