import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Non-fatal: the site renders with fallback content, but nothing loads from DB.
  console.warn(
    '[portfolio] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env and fill them in.',
  )
}

export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'anon', {
  auth: { persistSession: false },
})

export const ADMIN_API_URL =
  import.meta.env.VITE_ADMIN_API_URL || (url ? `${url}/functions/v1/admin-api` : '')
