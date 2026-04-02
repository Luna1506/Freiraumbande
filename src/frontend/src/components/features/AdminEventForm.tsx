import { useState, ChangeEvent, FormEvent } from 'react'
import { Event, CreateEventRequest } from '../../types'
import { GlassCard } from '../ui/GlassCard'
import { GlassButton } from '../ui/GlassButton'

interface AdminEventFormProps {
  event?: Event
  onSave: (data: CreateEventRequest) => Promise<void>
  onCancel: () => void
}

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/35 focus:outline-none focus:border-white/45 focus:bg-white/15 transition-colors text-sm'

export function AdminEventForm({ event, onSave, onCancel }: AdminEventFormProps) {
  const [form, setForm] = useState<CreateEventRequest>({
    title: event?.title ?? '',
    description: event?.description ?? '',
    date: event?.date ?? '',
    time: event?.time ? event.time.slice(0, 5) : '',
    location: event?.location ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof CreateEventRequest) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date) {
      setError('Titel und Datum sind Pflichtfelder.')
      return
    }
    setSaving(true)
    try {
      await onSave({
        ...form,
        time: form.time || undefined,
        description: form.description || undefined,
        location: form.location || undefined,
      })
    } catch {
      setError('Fehler beim Speichern. Bitte erneut versuchen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-white font-semibold mb-4">
        {event ? 'Termin bearbeiten' : 'Neuer Termin'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Titel *"
          value={form.title}
          onChange={set('title')}
          className={inputClass}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={set('date')}
            className={inputClass}
            required
          />
          <input
            type="time"
            value={form.time}
            onChange={set('time')}
            className={inputClass}
            placeholder="Uhrzeit (optional)"
          />
        </div>
        <input
          type="text"
          placeholder="Ort (optional)"
          value={form.location}
          onChange={set('location')}
          className={inputClass}
        />
        <textarea
          placeholder="Beschreibung (optional)"
          value={form.description}
          onChange={set('description')}
          rows={3}
          className={`${inputClass} resize-none`}
        />

        {error && <p className="text-red-300 text-sm">{error}</p>}

        <div className="flex gap-3 pt-1">
          <GlassButton type="submit" variant="success" disabled={saving}>
            {saving ? 'Speichern…' : 'Speichern'}
          </GlassButton>
          <GlassButton type="button" variant="danger" onClick={onCancel}>
            Abbrechen
          </GlassButton>
        </div>
      </form>
    </GlassCard>
  )
}
