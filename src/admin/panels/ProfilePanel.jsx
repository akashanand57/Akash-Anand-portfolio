import { useState } from 'react'
import { adminApi } from '../../lib/api'

const FIELDS = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'tagline', label: 'Tagline (hero headline)', type: 'textarea' },
  { key: 'summary', label: 'Summary (About section)', type: 'textarea' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
]

export default function ProfilePanel({ profile, reload, notify }) {
  const [form, setForm] = useState(() => ({ ...profile }))
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    try {
      const values = {}
      for (const f of FIELDS) values[f.key] = form[f.key] ?? ''
      await adminApi.saveProfile(values)
      notify('Profile saved.')
      await reload()
    } catch (e) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Profile</h2>
      <div className="card grid gap-4 p-6">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">{f.label}</span>
            {f.type === 'textarea' ? (
              <textarea
                rows={3}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                className="mt-1.5 w-full resize-y rounded-lg border border-line bg-void px-3 py-2.5 text-sm text-ink outline-none focus:border-primary/60"
              />
            ) : (
              <input
                value={form[f.key] ?? ''}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-line bg-void px-3 py-2.5 text-sm text-ink outline-none focus:border-primary/60"
              />
            )}
          </label>
        ))}
        <div>
          <button onClick={save} disabled={busy} className="btn btn-primary text-sm disabled:opacity-50">
            {busy ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
