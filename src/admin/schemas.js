// Field-driven schemas power the generic ResourcePanel CRUD editor.
// type: 'text' | 'textarea' | 'url' | 'bool' | 'tags' | 'lines'
//   tags  -> stored as jsonb array (comma / newline separated in the UI)
//   lines -> stored as jsonb array (one item per line)

export const RESOURCES = {
  skills: {
    label: 'Skills',
    singular: 'skill',
    fields: [
      { key: 'category', label: 'Category', type: 'text', required: true },
      { key: 'name', label: 'Name', type: 'text', required: true },
    ],
    title: (r) => r.name,
    subtitle: (r) => r.category,
  },
  experiences: {
    label: 'Experience',
    singular: 'role',
    fields: [
      { key: 'role', label: 'Role', type: 'text', required: true },
      { key: 'company', label: 'Company', type: 'text', required: true },
      { key: 'period', label: 'Period', type: 'text', placeholder: 'Sep 2025 - Present' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'highlights', label: 'Highlights (one per line)', type: 'lines' },
      { key: 'tags', label: 'Tags', type: 'tags' },
    ],
    title: (r) => r.role,
    subtitle: (r) => `${r.company} · ${r.period || ''}`,
  },
  projects: {
    label: 'Projects',
    singular: 'project',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'tech', label: 'Tech tags', type: 'tags' },
      { key: 'live_url', label: 'Live URL', type: 'url' },
      { key: 'repo_url', label: 'Repo URL', type: 'url' },
      { key: 'featured', label: 'Featured (large card)', type: 'bool' },
    ],
    title: (r) => r.title,
    subtitle: (r) => r.live_url || 'No live link',
  },
  certifications: {
    label: 'Certifications',
    singular: 'certification',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'issuer', label: 'Issuer', type: 'text' },
      { key: 'year', label: 'Year', type: 'text' },
    ],
    title: (r) => r.title,
    subtitle: (r) => `${r.issuer || ''} ${r.year || ''}`.trim(),
  },
  education: {
    label: 'Education',
    singular: 'entry',
    fields: [
      { key: 'degree', label: 'Degree', type: 'text', required: true },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'score', label: 'Score', type: 'text' },
    ],
    title: (r) => r.degree,
    subtitle: (r) => r.institution,
  },
  social_links: {
    label: 'Contact links',
    singular: 'link',
    fields: [
      { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'GitHub' },
      { key: 'url', label: 'URL', type: 'url', placeholder: 'https://github.com/…' },
      { key: 'handle', label: 'Handle / display text', type: 'text' },
    ],
    title: (r) => r.label,
    subtitle: (r) => r.url || 'No URL set',
  },
}

// Convert between stored values and form string values.
export function toFormValue(field, value) {
  if (field.type === 'tags' || field.type === 'lines') {
    return Array.isArray(value) ? value.join(field.type === 'lines' ? '\n' : ', ') : ''
  }
  if (field.type === 'bool') return !!value
  return value ?? ''
}

export function fromFormValue(field, raw) {
  if (field.type === 'tags') {
    return String(raw)
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (field.type === 'lines') {
    return String(raw)
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (field.type === 'bool') return !!raw
  return raw
}

export function emptyRecord(resourceKey) {
  const def = RESOURCES[resourceKey]
  const rec = {}
  for (const f of def.fields) {
    rec[f.key] = f.type === 'bool' ? false : f.type === 'tags' || f.type === 'lines' ? [] : ''
  }
  return rec
}
