// Converts the theme object stored in Supabase (hex colors) into the
// space-separated RGB CSS variables Tailwind reads.

export const DEFAULT_THEME = {
  bg: '#0A0B12',
  surface: '#12131C',
  line: '#232536',
  ink: '#EDEEF4',
  muted: '#9A9DB2',
  primary: '#C9F24D',
  secondary: '#7C6CFF',
  accent: '#FF8A5B',
  radius: 16,
}

const VAR_MAP = {
  bg: '--c-bg',
  surface: '--c-surface',
  line: '--c-line',
  ink: '--c-ink',
  muted: '--c-muted',
  primary: '--c-primary',
  secondary: '--c-secondary',
  accent: '--c-accent',
}

function hexToRgbChannels(hex) {
  if (typeof hex !== 'string') return null
  let h = hex.replace('#', '').trim()
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return null
  const n = parseInt(h, 16)
  if (Number.isNaN(n)) return null
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

export function applyTheme(theme) {
  const t = { ...DEFAULT_THEME, ...(theme || {}) }
  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(VAR_MAP)) {
    const channels = hexToRgbChannels(t[key])
    if (channels) root.style.setProperty(cssVar, channels)
  }
  if (t.radius != null) root.style.setProperty('--radius', `${t.radius}px`)
  // Keep the browser UI theme-color in sync
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta && t.bg) meta.setAttribute('content', t.bg)
}
