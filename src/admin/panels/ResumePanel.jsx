import { useState } from 'react'
import { adminApi } from '../../lib/api'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1]) // strip data: prefix
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ResumePanel({ profile, reload, notify }) {
  const [busy, setBusy] = useState(false)

  async function onUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      notify('Please choose a PDF file.', 'error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      notify('PDF is larger than 10 MB.', 'error')
      return
    }
    setBusy(true)
    try {
      const b64 = await fileToBase64(file)
      await adminApi.uploadResume(file.name, b64, file.type)
      notify('Resume uploaded.')
      await reload()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  async function remove() {
    if (!confirm('Remove the current resume from the site?')) return
    setBusy(true)
    try {
      await adminApi.removeResume()
      notify('Resume removed.')
      await reload()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Resume</h2>
      <div className="card p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">Current file</p>
        {profile?.resume_url ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn btn-ghost text-sm">
              View / Download ↗
            </a>
            <button onClick={remove} disabled={busy} className="btn btn-ghost text-sm">
              Remove
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No resume uploaded yet.</p>
        )}

        <div className="mt-6 border-t border-line pt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Upload new (PDF)</p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2">
            <span className="btn btn-primary text-sm">{busy ? 'Uploading…' : 'Choose PDF'}</span>
            <input type="file" accept="application/pdf" onChange={onUpload} disabled={busy} className="hidden" />
          </label>
          <p className="mt-3 font-mono text-[11px] text-muted">
            Visitors get a "Resume" link in the hero and contact sections once a file is set.
          </p>
        </div>
      </div>
    </div>
  )
}
