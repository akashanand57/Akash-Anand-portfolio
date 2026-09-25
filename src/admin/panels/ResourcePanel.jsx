import { useState } from 'react'
import { adminApi } from '../../lib/api'
import { RESOURCES, fromFormValue, emptyRecord } from '../schemas'
import Field from '../ui/Field'

export default function ResourcePanel({ resourceKey, items, reload, notify }) {
  const def = RESOURCES[resourceKey]
  const [editing, setEditing] = useState(null) // record being edited (or 'new')
  const [form, setForm] = useState({})
  const [busy, setBusy] = useState(false)

  function startAdd() {
    setForm(emptyRecord(resourceKey))
    setEditing('new')
  }
  function startEdit(item) {
    // Field converts raw values (arrays stay arrays) for display via toFormValue.
    setForm({ ...item })
    setEditing(item.id)
  }
  function cancel() {
    setEditing(null)
    setForm({})
  }

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save() {
    setBusy(true)
    try {
      const values = {}
      for (const field of def.fields) {
        values[field.key] = fromFormValue(field, form[field.key])
      }
      if (editing === 'new') {
        values.sort_order = items.length
        await adminApi.create(resourceKey, values)
        notify('Added.')
      } else {
        await adminApi.update(resourceKey, editing, values)
        notify('Saved.')
      }
      await reload()
      cancel()
    } catch (e) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function remove(item) {
    if (!confirm(`Delete this ${def.singular}? This cannot be undone.`)) return
    setBusy(true)
    try {
      await adminApi.remove(resourceKey, item.id)
      notify('Deleted.')
      await reload()
    } catch (e) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function move(index, dir) {
    const next = index + dir
    if (next < 0 || next >= items.length) return
    const reordered = [...items]
    ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
    const payload = reordered.map((it, i) => ({ id: it.id, sort_order: i }))
    setBusy(true)
    try {
      await adminApi.reorder(resourceKey, payload)
      await reload()
    } catch (e) {
      notify(e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{def.label}</h2>
          <p className="mt-1 font-mono text-xs text-muted">{items.length} item(s)</p>
        </div>
        {!editing && (
          <button onClick={startAdd} className="btn btn-primary text-sm">
            + Add {def.singular}
          </button>
        )}
      </div>

      {editing ? (
        <div className="card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-ink">
            {editing === 'new' ? `New ${def.singular}` : `Edit ${def.singular}`}
          </h3>
          <div className="grid gap-4">
            {def.fields.map((field) => (
              <Field
                key={field.key}
                field={field}
                value={form[field.key]}
                onChange={(v) => setField(field.key, v)}
              />
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={save} disabled={busy} className="btn btn-primary text-sm disabled:opacity-50">
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} className="btn btn-ghost text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.length === 0 && (
            <li className="card p-6 text-center font-mono text-sm text-muted">
              Nothing yet. Add your first {def.singular}.
            </li>
          )}
          {items.map((item, i) => (
            <li
              key={item.id}
              className="card flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-display font-medium text-ink">{def.title(item)}</p>
                <p className="truncate font-mono text-xs text-muted">{def.subtitle(item)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || busy}
                  className="grid h-8 w-8 place-items-center rounded-md border border-line text-muted hover:text-ink disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1 || busy}
                  className="grid h-8 w-8 place-items-center rounded-md border border-line text-muted hover:text-ink disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-ink hover:border-primary/60"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(item)}
                  className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-accent hover:border-accent/60"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
