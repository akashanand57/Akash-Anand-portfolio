import { useState } from 'react'
import { adminApi } from '../../lib/api'

export default function SecurityPanel({ notify }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (next.length < 8) return notify('New passcode must be at least 8 characters.', 'error')
    if (next !== confirm) return notify('New passcodes do not match.', 'error')
    setBusy(true)
    try {
      await adminApi.changePasscode(current, next)
      notify('Passcode changed.')
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const inputCls =
    'mt-1.5 w-full rounded-lg border border-line bg-void px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-primary/60'

  return (
    <div>
      <h2 className="mb-2 font-display text-2xl font-semibold text-ink">Security</h2>
      <p className="mb-6 font-mono text-xs text-muted">
        The passcode is verified and re-hashed server-side. It is never stored in plain text.
      </p>
      <form onSubmit={submit} className="card grid max-w-md gap-4 p-6">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Current passcode</span>
          <input type="password" autoComplete="off" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">New passcode</span>
          <input type="password" autoComplete="off" value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Confirm new passcode</span>
          <input type="password" autoComplete="off" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
        </label>
        <div>
          <button type="submit" disabled={busy} className="btn btn-primary text-sm disabled:opacity-50">
            {busy ? 'Updating…' : 'Change passcode'}
          </button>
        </div>
      </form>
    </div>
  )
}
