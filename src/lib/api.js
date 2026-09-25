import { supabase, ADMIN_API_URL } from './supabase'

// ── Public reads (anon key, RLS-limited to SELECT) ───────────────────────────
export async function fetchAllContent() {
  const [
    profile,
    social,
    skills,
    experiences,
    projects,
    certifications,
    education,
    settings,
  ] = await Promise.all([
    supabase.from('profile').select('*').eq('id', 1).single(),
    supabase.from('social_links').select('*').order('sort_order'),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('experiences').select('*').order('sort_order'),
    supabase.from('projects').select('*').order('sort_order'),
    supabase.from('certifications').select('*').order('sort_order'),
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('settings').select('*').eq('id', 1).single(),
  ])

  return {
    profile: profile.data || null,
    social: social.data || [],
    skills: skills.data || [],
    experiences: experiences.data || [],
    projects: projects.data || [],
    certifications: certifications.data || [],
    education: education.data || [],
    theme: settings.data?.theme || null,
  }
}

// ── Admin session token (kept in sessionStorage; cleared on tab close) ────────
const TOKEN_KEY = 'aa_admin_token'
export const getToken = () => sessionStorage.getItem(TOKEN_KEY)
export const setToken = (t) => sessionStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY)

// ── Admin mutations (all go through the Edge Function) ────────────────────────
async function callAdmin(action, payload = {}, withAuth = true) {
  if (!ADMIN_API_URL) throw new Error('Admin API URL not configured')
  const headers = { 'Content-Type': 'application/json' }
  if (withAuth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...payload }),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    /* ignore */
  }
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const adminApi = {
  login: (passcode) => callAdmin('login', { passcode }, false),
  verify: () => callAdmin('verify'),
  changePasscode: (currentPasscode, newPasscode) =>
    callAdmin('change-passcode', { currentPasscode, newPasscode }),
  create: (resource, values) => callAdmin('create', { resource, values }),
  update: (resource, id, values) => callAdmin('update', { resource, id, values }),
  remove: (resource, id) => callAdmin('delete', { resource, id }),
  reorder: (resource, items) => callAdmin('reorder', { resource, items }),
  saveProfile: (values) => callAdmin('save-profile', { values }),
  saveTheme: (theme) => callAdmin('save-theme', { theme }),
  uploadResume: (filename, contentBase64, contentType) =>
    callAdmin('upload-resume', { filename, contentBase64, contentType }),
  removeResume: () => callAdmin('remove-resume'),
}
