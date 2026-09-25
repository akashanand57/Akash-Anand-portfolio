// ============================================================================
//  admin-api  —  Supabase Edge Function (Deno)
//
//  The single trusted gateway for the admin panel. Responsibilities:
//    * login            → verify passcode (server-side, constant-time), mint JWT
//    * change-passcode  → re-hash a new passcode (requires a valid session)
//    * create / update / delete / reorder → content mutations (requires session)
//    * upload-resume / remove-resume       → storage writes (requires session)
//
//  Everything here runs with the service_role key, which bypasses RLS. The
//  passcode is only ever compared as a hash. The frontend never sees the
//  service_role key or the raw passcode hash.
//
//  Required secrets (set via `supabase secrets set` — see README):
//    ADMIN_JWT_SECRET            long random string used to sign sessions
//    SUPABASE_URL                (auto-provided)
//    SUPABASE_SERVICE_ROLE_KEY   (auto-provided)
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import {
  create as jwtCreate,
  verify as jwtVerify,
  getNumericDate,
} from 'https://deno.land/x/djwt@v3.0.2/mod.ts'

// ── PBKDF2 params (MUST match scripts/generate-passcode-hash.mjs) ────────────
const PBKDF2_ITERATIONS = 210_000
const PBKDF2_KEYLEN = 32
const HASH_PREFIX = 'pbkdf2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const RESOURCES = new Set([
  'skills',
  'experiences',
  'projects',
  'certifications',
  'education',
  'social_links',
])

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// ── Crypto helpers ───────────────────────────────────────────────────────────
function b64encode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}
function b64decode(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0))
}

async function pbkdf2(
  passcode: string,
  salt: Uint8Array,
  iterations: number,
): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passcode),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    PBKDF2_KEYLEN * 8,
  )
}

async function hashPasscode(passcode: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derived = await pbkdf2(passcode, salt, PBKDF2_ITERATIONS)
  return `${HASH_PREFIX}$${PBKDF2_ITERATIONS}$${b64encode(salt.buffer)}$${b64encode(derived)}`
}

// constant-time string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

async function verifyPasscode(passcode: string, stored: string): Promise<boolean> {
  try {
    const [prefix, iterStr, saltB64, hashB64] = stored.split('$')
    if (prefix !== HASH_PREFIX) return false
    const iterations = parseInt(iterStr, 10)
    const salt = b64decode(saltB64)
    const derived = await pbkdf2(passcode, salt, iterations)
    return timingSafeEqual(b64encode(derived), hashB64)
  } catch {
    return false
  }
}

// ── JWT helpers ──────────────────────────────────────────────────────────────
async function jwtKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('ADMIN_JWT_SECRET')
  if (!secret) throw new Error('ADMIN_JWT_SECRET not configured')
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function mintSession(): Promise<string> {
  const key = await jwtKey()
  return jwtCreate(
    { alg: 'HS256', typ: 'JWT' },
    { scope: 'admin', exp: getNumericDate(60 * 60 * 8) }, // 8h
    key,
  )
}

async function requireSession(req: Request, bodyToken?: string): Promise<boolean> {
  const header = req.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : bodyToken
  if (!token) return false
  try {
    const payload = await jwtVerify(token, await jwtKey())
    return payload.scope === 'admin'
  } catch {
    return false
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  let body: Record<string, any>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid request' }, 400)
  }
  const { action } = body

  // ── LOGIN (public) ─────────────────────────────────────────────────────────
  if (action === 'login') {
    const passcode = String(body.passcode ?? '')
    const { data } = await admin
      .from('admin_config')
      .select('passcode_hash')
      .eq('id', 1)
      .single()

    // Generic failure for every path — never reveal whether setup is done.
    if (!data?.passcode_hash || !(await verifyPasscode(passcode, data.passcode_hash))) {
      return json({ error: 'incorrect passcode' }, 401)
    }
    return json({ token: await mintSession() })
  }

  // ── Everything below requires a valid session ────────────────────────────────
  if (!(await requireSession(req, body.token))) {
    return json({ error: 'unauthorized' }, 401)
  }

  try {
    switch (action) {
      case 'verify':
        return json({ ok: true })

      case 'change-passcode': {
        const current = String(body.currentPasscode ?? '')
        const next = String(body.newPasscode ?? '')
        if (next.length < 8) {
          return json({ error: 'new passcode must be at least 8 characters' }, 400)
        }
        const { data } = await admin
          .from('admin_config')
          .select('passcode_hash')
          .eq('id', 1)
          .single()
        if (!data?.passcode_hash || !(await verifyPasscode(current, data.passcode_hash))) {
          return json({ error: 'incorrect passcode' }, 401)
        }
        const passcode_hash = await hashPasscode(next)
        await admin
          .from('admin_config')
          .update({ passcode_hash, updated_at: new Date().toISOString() })
          .eq('id', 1)
        return json({ ok: true })
      }

      case 'create': {
        const { resource, values } = body
        if (!RESOURCES.has(resource)) return json({ error: 'bad resource' }, 400)
        const { data, error } = await admin.from(resource).insert(values).select().single()
        if (error) return json({ error: error.message }, 400)
        return json({ data })
      }

      case 'update': {
        const { resource, id, values } = body
        if (!RESOURCES.has(resource)) return json({ error: 'bad resource' }, 400)
        const { data, error } = await admin
          .from(resource)
          .update(values)
          .eq('id', id)
          .select()
          .single()
        if (error) return json({ error: error.message }, 400)
        return json({ data })
      }

      case 'delete': {
        const { resource, id } = body
        if (!RESOURCES.has(resource)) return json({ error: 'bad resource' }, 400)
        const { error } = await admin.from(resource).delete().eq('id', id)
        if (error) return json({ error: error.message }, 400)
        return json({ ok: true })
      }

      case 'reorder': {
        // body.items = [{ id, sort_order }, ...]
        const { resource, items } = body
        if (!RESOURCES.has(resource)) return json({ error: 'bad resource' }, 400)
        for (const it of items ?? []) {
          await admin.from(resource).update({ sort_order: it.sort_order }).eq('id', it.id)
        }
        return json({ ok: true })
      }

      case 'save-profile': {
        const { values } = body
        const { data, error } = await admin
          .from('profile')
          .update(values)
          .eq('id', 1)
          .select()
          .single()
        if (error) return json({ error: error.message }, 400)
        return json({ data })
      }

      case 'save-theme': {
        const { theme } = body
        const { data, error } = await admin
          .from('settings')
          .update({ theme })
          .eq('id', 1)
          .select()
          .single()
        if (error) return json({ error: error.message }, 400)
        return json({ data })
      }

      case 'upload-resume': {
        // body.filename, body.contentBase64, body.contentType
        const filename = String(body.filename ?? 'resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `resume-${Date.now()}-${filename}`
        const bytes = b64decode(String(body.contentBase64 ?? ''))
        const { error: upErr } = await admin.storage
          .from('resume')
          .upload(path, bytes, {
            contentType: body.contentType || 'application/pdf',
            upsert: true,
          })
        if (upErr) return json({ error: upErr.message }, 400)
        const { data: pub } = admin.storage.from('resume').getPublicUrl(path)
        const { data, error } = await admin
          .from('profile')
          .update({ resume_url: pub.publicUrl })
          .eq('id', 1)
          .select()
          .single()
        if (error) return json({ error: error.message }, 400)
        return json({ data })
      }

      case 'remove-resume': {
        const { data, error } = await admin
          .from('profile')
          .update({ resume_url: null })
          .eq('id', 1)
          .select()
          .single()
        if (error) return json({ error: error.message }, 400)
        return json({ data })
      }

      default:
        return json({ error: 'unknown action' }, 400)
    }
  } catch (e) {
    return json({ error: (e as Error).message ?? 'server error' }, 500)
  }
})
