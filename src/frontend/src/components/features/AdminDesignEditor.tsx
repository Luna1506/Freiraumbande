import { useRef, useState } from 'react'
import { useContent } from '../../hooks/useContent'
import { contentService } from '../../services/contentService'
import { BACKGROUND_KEY } from '../../content/defaults'
import { GlassCard } from '../ui/GlassCard'
import { GlassButton } from '../ui/GlassButton'
import heroImg from '../../assets/hero.jpg'

/** Bildmaße auslesen, ohne das Bild hochzuladen. */
function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

export function AdminDesignEditor() {
  const { text, refresh } = useContent()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error' | 'warn'; text: string } | null>(null)

  const customBackground = text(BACKGROUND_KEY)
  const currentBackground = customBackground || heroImg

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setMessage(null)
    try {
      const size = await readImageSize(file)
      await contentService.uploadBackground(file)
      await refresh()
      if (size && size.width < 1280) {
        setMessage({
          type: 'warn',
          text: `Hintergrund aktualisiert — aber das Bild ist nur ${size.width} px breit und wirkt auf großen Bildschirmen unscharf. Empfohlen: mindestens 1920 px.`,
        })
      } else {
        setMessage({ type: 'ok', text: 'Hintergrund aktualisiert.' })
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Upload fehlgeschlagen. Erlaubt sind JPEG, PNG, WebP und AVIF bis 10 MB.',
      })
    } finally {
      setBusy(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleReset = async () => {
    if (!confirm('Hintergrund wirklich auf den Standard zurücksetzen?')) return
    setBusy(true)
    setMessage(null)
    try {
      await contentService.resetBackground()
      await refresh()
      setMessage({ type: 'ok', text: 'Standard-Hintergrund wiederhergestellt.' })
    } catch {
      setMessage({ type: 'error', text: 'Zurücksetzen fehlgeschlagen.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-white font-semibold mb-1">Hintergrundbild</h3>
      <p className="text-white/50 text-sm mb-4">
        Das Bild wird vollflächig hinter allen Seiten angezeigt. Am besten eignen sich Fotos im
        Querformat mit mindestens 1920 px Breite.
      </p>

      {/* Vorschau */}
      <div
        className="rounded-xl border border-white/20 overflow-hidden mb-4 relative"
        style={{ aspectRatio: '16 / 7' }}
      >
        <img
          src={currentBackground}
          alt="Aktueller Hintergrund"
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/50 rounded-lg px-2 py-1">
          {customBackground ? 'Eigenes Bild' : 'Standard'}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={e => handleFileChange(e.target.files?.[0])}
      />

      <div className="flex flex-wrap items-center gap-3">
        <GlassButton onClick={() => fileInputRef.current?.click()} disabled={busy}>
          {busy ? 'Bitte warten…' : '📤 Neues Bild hochladen'}
        </GlassButton>
        {customBackground && (
          <GlassButton variant="danger" onClick={handleReset} disabled={busy}>
            ↺ Standard wiederherstellen
          </GlassButton>
        )}
        {message && (
          <span
            className={
              message.type === 'ok'
                ? 'text-emerald-300 text-sm'
                : message.type === 'warn'
                  ? 'text-amber-300 text-sm'
                  : 'text-red-300 text-sm'
            }
          >
            {message.text}
          </span>
        )}
      </div>
    </GlassCard>
  )
}
