import { useState } from 'react'
import { CONTENT_SECTIONS, ContentSection, DEFAULT_CONTENT } from '../../content/defaults'
import { useContent } from '../../hooks/useContent'
import { contentService } from '../../services/contentService'
import { GlassCard } from '../ui/GlassCard'
import { GlassButton } from '../ui/GlassButton'

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/35 focus:outline-none focus:border-white/45 focus:bg-white/15 transition-colors text-sm'

function SectionEditor({ section }: { section: ContentSection }) {
  const { text, overrides, refresh } = useContent()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  // Effektiver Wert: lokale Änderung > Override > Default
  const valueOf = (key: string) => draft[key] ?? text(key)
  const isDirty = Object.entries(draft).some(([key, value]) => value !== text(key))

  const handleChange = (key: string, value: string) => {
    setDraft(d => ({ ...d, [key]: value }))
    setMessage(null)
  }

  const handleReset = async (key: string) => {
    setSaving(true)
    setMessage(null)
    try {
      await contentService.update({ [key]: '' })
      await refresh()
      setDraft(d => {
        const next = { ...d }
        delete next[key]
        return next
      })
      setMessage({ type: 'ok', text: 'Feld zurückgesetzt.' })
    } catch {
      setMessage({ type: 'error', text: 'Zurücksetzen fehlgeschlagen.' })
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    const changed: Record<string, string> = {}
    let resetCount = 0
    for (const [key, value] of Object.entries(draft)) {
      if (value !== text(key)) {
        // Leer oder identisch zum Default → Override löschen (Standardtext greift wieder)
        const isReset = value.trim() === '' || value.trim() === (DEFAULT_CONTENT[key] ?? '').trim()
        changed[key] = isReset ? '' : value
        if (isReset) resetCount++
      }
    }
    if (Object.keys(changed).length === 0) return

    setSaving(true)
    setMessage(null)
    try {
      await contentService.update(changed)
      await refresh()
      // Nur die gespeicherten Keys verwerfen — Eingaben während des Requests bleiben erhalten
      setDraft(d => {
        const next = { ...d }
        for (const key of Object.keys(changed)) delete next[key]
        return next
      })
      setMessage({
        type: 'ok',
        text: resetCount > 0
          ? 'Gespeichert. Geleerte Felder zeigen wieder den Standardtext.'
          : 'Gespeichert.',
      })
    } catch {
      setMessage({ type: 'error', text: 'Speichern fehlgeschlagen. Bitte erneut versuchen.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <GlassCard className="overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-semibold">{section.title}</span>
        <span className="text-white/40 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-4">
          {section.fields.map(field => {
            const overridden = field.key in overrides
            return (
              <div key={field.key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-white/60 text-xs font-medium" htmlFor={field.key}>
                    {field.label}
                    {overridden && <span className="text-emerald-300/70 ml-2">• angepasst</span>}
                  </label>
                  {overridden && (
                    <button
                      onClick={() => handleReset(field.key)}
                      disabled={saving}
                      className="text-white/35 text-xs hover:text-white transition-colors cursor-pointer"
                      title="Auf Standardtext zurücksetzen"
                    >
                      ↺ Standard
                    </button>
                  )}
                </div>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.key}
                    value={valueOf(field.key)}
                    onChange={e => handleChange(field.key, e.target.value)}
                    rows={3}
                    disabled={saving}
                    className={`${inputClass} resize-y disabled:opacity-60`}
                  />
                ) : (
                  <input
                    id={field.key}
                    type="text"
                    value={valueOf(field.key)}
                    onChange={e => handleChange(field.key, e.target.value)}
                    disabled={saving}
                    className={`${inputClass} disabled:opacity-60`}
                  />
                )}
                {field.hint && <p className="text-white/30 text-xs mt-1">{field.hint}</p>}
              </div>
            )
          })}

          <div className="flex items-center gap-3 pt-1">
            <GlassButton variant="success" onClick={handleSave} disabled={saving || !isDirty}>
              {saving ? 'Speichern…' : 'Speichern'}
            </GlassButton>
            {message && (
              <span className={message.type === 'ok' ? 'text-emerald-300 text-sm' : 'text-red-300 text-sm'}>
                {message.text}
              </span>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  )
}

export function AdminContentEditor() {
  return (
    <div className="space-y-4">
      <p className="text-white/50 text-sm">
        Hier lassen sich alle Texte der Website anpassen — Änderungen sind sofort für alle
        Besucher sichtbar. „↺ Standard" stellt den ursprünglichen Text wieder her.
      </p>
      {CONTENT_SECTIONS.map(section => (
        <SectionEditor key={section.id} section={section} />
      ))}
    </div>
  )
}
