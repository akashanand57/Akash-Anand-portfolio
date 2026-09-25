#!/usr/bin/env node
/**
 * Generates the initial admin passcode hash to seed `admin_config`.
 *
 * Usage:
 *   node scripts/generate-passcode-hash.mjs "YourStrongPasscodeHere"
 *
 * It prints a ready-to-run SQL statement. Paste it into the Supabase SQL Editor.
 * The passcode itself never leaves your machine — only its hash is stored.
 *
 * The PBKDF2 parameters here MUST match supabase/functions/admin-api/index.ts.
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto'

const ITERATIONS = 210_000
const KEYLEN = 32
const DIGEST = 'sha256'

const passcode = process.argv[2]
if (!passcode || passcode.length < 8) {
  console.error('\n  Provide a passcode of at least 8 characters:')
  console.error('    node scripts/generate-passcode-hash.mjs "YourStrongPasscode"\n')
  process.exit(1)
}

const salt = randomBytes(16)
const derived = pbkdf2Sync(passcode, salt, ITERATIONS, KEYLEN, DIGEST)
const hash = `pbkdf2$${ITERATIONS}$${salt.toString('base64')}$${derived.toString('base64')}`

console.log('\n  Passcode hash generated. Run this in the Supabase SQL Editor:\n')
console.log(
  `  update public.admin_config set passcode_hash = '${hash}', updated_at = now() where id = 1;\n`,
)
console.log('  (You can change the passcode later from inside the admin panel.)\n')
