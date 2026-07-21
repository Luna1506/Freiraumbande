import { useRef, useState, FormEvent, ChangeEvent } from 'react'
import { Member } from '../../types'
import { MemberFormData } from '../../services/memberService'
import { GlassCard } from '../ui/GlassCard'
import { GlassButton } from '../ui/GlassButton'

const inputClass =
  'liquid-field w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/35 focus:outline-none focus:border-white/45 transition-colors text-sm'

interface AdminMemberFormProps {
  /** Ohne member: Anlegen; mit member: Bearbeiten. Das Foto ist in beiden Fällen optional. */
  member?: Member
  onSave: (data: MemberFormData) => Promise<void>
  onCancel: () => void
}

export function AdminMemberForm({ member, onSave, onCancel }: AdminMemberFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    if (selected) setRemovePhoto(false)
    setPreview(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return selected ? URL.createObjectURL(selected) : null
    })
  }

  const handleRemovePhoto = () => {
    setRemovePhoto(true)
    setFile(null)
    setPreview(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = (data.get('name') as string).trim()
    const role = (data.get('role') as string).trim()
    setSaving(true)
    setError('')
    try {
      await onSave({
        name,
        role: role || undefined,
        file: file ?? undefined,
        removePhoto: removePhoto || undefined,
      })
    } catch {
      setError('Speichern fehlgeschlagen. Erlaubt sind JPEG, PNG, WebP und AVIF bis 10 MB.')
    } finally {
      setSaving(false)
    }
  }

  const shownImage = preview ?? (removePhoto ? null : member?.imageUrl ?? null)

  return (
    <GlassCard className="p-6">
      <h3 className="text-white font-semibold mb-4">
        {member ? 'Mitglied bearbeiten' : 'Neues Mitglied'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          {shownImage ? (
            <img
              src={shownImage}
              alt="Foto-Vorschau"
              className="w-20 h-20 rounded-full object-cover border border-white/25 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/40 text-2xl flex-shrink-0">
              👤
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-wrap gap-2">
              <GlassButton type="button" onClick={() => fileInputRef.current?.click()}>
                {shownImage ? 'Foto ersetzen…' : 'Foto auswählen… (optional)'}
              </GlassButton>
              {shownImage && (
                <GlassButton type="button" variant="danger" onClick={handleRemovePhoto}>
                  Foto entfernen
                </GlassButton>
              )}
            </div>
            {member?.imageUrl && !file && !removePhoto && (
              <p className="text-white/40 text-xs mt-2">Ohne Auswahl bleibt das aktuelle Foto.</p>
            )}
            {removePhoto && (
              <p className="text-white/40 text-xs mt-2">
                Das Foto wird beim Speichern entfernt — stattdessen erscheint die Initiale.
              </p>
            )}
          </div>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          maxLength={100}
          defaultValue={member?.name ?? ''}
          className={inputClass}
        />
        <input
          type="text"
          name="role"
          placeholder="Rolle / Kurztext (optional)"
          maxLength={150}
          defaultValue={member?.role ?? ''}
          className={inputClass}
        />

        {error && <p className="text-red-300 text-sm">{error}</p>}

        <div className="flex gap-2">
          <GlassButton type="submit" variant="success" disabled={saving}>
            {saving ? 'Speichern…' : 'Speichern'}
          </GlassButton>
          <GlassButton type="button" onClick={onCancel} disabled={saving}>
            Abbrechen
          </GlassButton>
        </div>
      </form>
    </GlassCard>
  )
}
