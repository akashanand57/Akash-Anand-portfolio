import { useState } from 'react'
import { adminApi } from '../../lib/api'
import { applyTheme, DEFAULT_THEME } from '../../lib/theme'

const SWATCHES = [
  { key: 'bg', label: 'Background' },
  { key: 'surface', label: 'Surface / cards' },
  { key: 'line', label: 'Borders / lines' },
  { key: 'ink', label: 'Text (primary)' },
  { key: 'muted', label: 'Text (muted)' },
  { key: 'primary', label: 'Primary accent' },
  { key: 'secondary', label: 'Secondary accent' },
  { key: 'accent', label: 'Tertiary / signal' },
]

const PRESETS = {
  'Agentic (default)': DEFAULT_THEME,
  'Cyber Violet': { ...DEFAULT_THEME, primary: '#9B8CFF', secondary: '#00E5C4', accent: '#FF6BAA', bg: '#0B0A16', surface: '#151327', line: '#2A2745' },
  'Signal Amber': { ...DEFAULT_THEME, primary: '#FFB020', secondary: '#5B8CFF', accent: '#FF5C5C', bg: '#0C0B09', surface: '#17140F', line: '#2C2820' },
  'Ice Terminal': { ...DEFAULT_THEME, primary: '#5EEAD4', secondary: '#60A5FA', accent: '#F472B6', bg: '#080D10', surface: '#101A1E', line: '#1F2E33' },
}

export default function ThemePanel({ theme, reload, notify }) {
  const [form, setForm] = useState(() => ({ ...DEFAULT_THEME, ...theme }))
  const [busy, setBusy] = useState(false)

  function update(next) {
    setForm(next)
    applyTheme(next) // live preview across the whole app
  }
  function setColor(key, value) {
    update({ ...form, [key]: value })
  }
  function applyPreset(preset) {
    update({ ...preset })
  }

  async function save() {
    setBusy(true)
    try {
      await adminApi.saveTheme(form)
      notify('Theme saved & live.')
      await reload()
    } catch (e) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  function reset() {
    update({ ...DEFAULT_THEME })
  }

  return (
    <div>
      <h2 className="mb-2 font-display text-2xl font-semibold text-ink">Theme</h2>
      <p className="mb-6 font-mono text-xs text-muted">
        Changes preview live. They only persist for visitors once you save.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => applyPreset(PRESETS[name])}
            className="rounded-full border border-line px-4 py-2 font-mono text-xs text-ink hover:border-primary/60"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        {SWATCHES.map((s) => (
          <div key={s.key} className="flex items-center gap-3">
            <input
              type="color"
              value={form[s.key] || '#000000'}
              onChange={(e) => setColor(s.key, e.target.value)}
              className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-line bg-transparent"
              aria-label={s.label}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{s.label}</p>
              <input
                value={form[s.key] || ''}
                onChange={(e) => setColor(s.key, e.target.value)}
                className="mt-1 w-full rounded border border-line bg-void px-2 py-1 font-mono text-xs text-muted outline-none focus:border-primary/60"
              />
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Corner radius</span>
          <input
            type="range"
            min="0"
            max="28"
            value={form.radius ?? 16}
            onChange={(e) => setColor('radius', Number(e.target.value))}
            className="flex-1 accent-[rgb(var(--c-primary))]"
          />
          <span className="w-10 font-mono text-xs text-ink">{form.radius ?? 16}px</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={save} disabled={busy} className="btn btn-primary text-sm disabled:opacity-50">
          {busy ? 'Saving…' : 'Save theme'}
        </button>
        <button onClick={reset} className="btn btn-ghost text-sm">
          Reset to default
        </button>
      </div>
    </div>
  )
}
