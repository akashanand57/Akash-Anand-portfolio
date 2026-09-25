import { toFormValue } from '../schemas'

const inputCls =
  'mt-1.5 w-full rounded-lg border border-line bg-void px-3 py-2.5 text-sm text-ink outline-none focus:border-primary/60'

export default function Field({ field, value, onChange }) {
  const v = toFormValue(field, value)

  if (field.type === 'bool') {
    return (
      <label className="flex cursor-pointer items-center gap-3 py-2">
        <input
          type="checkbox"
          checked={!!v}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[rgb(var(--c-primary))]"
        />
        <span className="text-sm text-ink">{field.label}</span>
      </label>
    )
  }

  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-muted">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </span>
      {field.type === 'textarea' || field.type === 'lines' || field.type === 'tags' ? (
        <textarea
          rows={field.type === 'lines' ? 4 : field.type === 'tags' ? 2 : 3}
          value={v}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + ' resize-y font-sans'}
        />
      ) : (
        <input
          type={field.type === 'url' ? 'url' : 'text'}
          value={v}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
      {field.type === 'tags' && (
        <span className="mt-1 block font-mono text-[11px] text-muted">
          Separate with commas or new lines
        </span>
      )}
    </label>
  )
}
