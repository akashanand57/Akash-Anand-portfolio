// Rasterizes public/og-image.svg to public/og-image.png (1200x630).
// Dev-only helper; sharp is installed with --no-save.
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'public', 'og-image.svg'))

await sharp(svg, { density: 200 })
  .resize(1200, 630)
  .png()
  .toFile(join(root, 'public', 'og-image.png'))

console.log('Wrote public/og-image.png')
