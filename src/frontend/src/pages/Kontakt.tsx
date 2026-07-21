import { FormEvent } from 'react'
import { useContent } from '../hooks/useContent'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassButton } from '../components/ui/GlassButton'

const inputClass =
  'liquid-field w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/35 focus:outline-none focus:border-white/45 focus:bg-white/15 transition-colors text-sm'

/** Link nur rendern, wenn eine URL hinterlegt ist — sonst reiner Text ohne Hover-Effekt. */
function SocialLink({ url, label }: { url: string; label: string }) {
  if (!url) {
    return <span className="block text-white/65 text-sm">{label}</span>
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block text-white/65 text-sm hover:text-white transition-colors"
    >
      {label}
    </a>
  )
}

/** Zeilen im Format "Tag|Uhrzeit" in Zeilenpaare zerlegen. */
function parseHours(raw: string): { day: string; time: string }[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [day, time] = line.split('|')
      return { day: (day ?? '').trim(), time: (time ?? '').trim() }
    })
}

export function Kontakt() {
  const { text } = useContent()
  const email = text('contact.email')
  const hours = parseHours(text('contact.hours'))
  const instagramUrl = text('contact.instagramUrl')
  const facebookUrl = text('contact.facebookUrl')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = encodeURIComponent(data.get('name') as string)
    const senderEmail = encodeURIComponent(data.get('email') as string)
    const message = encodeURIComponent(data.get('message') as string)
    window.location.href =
      `mailto:${email}?subject=Nachricht%20von%20${name}&body=${message}%0A%0AAntwort%20an%3A%20${senderEmail}`
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-6xl font-bold text-white uppercase mb-2 text-shadow">
          Kontakt
        </h1>
        <div className="w-16 h-0.5 bg-white/30 mb-12" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact form */}
          <GlassCard className="p-8">
            <h2 className="font-display text-2xl font-semibold text-white uppercase mb-6">
              Schreib uns
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Dein Name *"
                aria-label="Dein Name"
                required
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                placeholder="E-Mail-Adresse *"
                aria-label="E-Mail-Adresse"
                required
                className={inputClass}
              />
              <textarea
                name="message"
                placeholder="Deine Nachricht *"
                aria-label="Deine Nachricht"
                rows={5}
                required
                className={`${inputClass} resize-none`}
              />
              <GlassButton type="submit" className="w-full py-3">
                Nachricht senden
              </GlassButton>
            </form>
            <p className="text-white/30 text-xs mt-3">
              Das Formular öffnet deinen E-Mail-Client.
            </p>
          </GlassCard>

          {/* Info cards */}
          <div className="space-y-4">
            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                📍 Adresse
              </h3>
              <p className="text-white/65 text-sm leading-relaxed whitespace-pre-line">
                {text('contact.address')}
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                ✉️ E-Mail
              </h3>
              <a
                href={`mailto:${email}`}
                className="text-white/65 text-sm hover:text-white transition-colors"
              >
                {email}
              </a>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3">🕐 Trainings- und Spielzeiten</h3>
              <div className="text-white/65 text-sm space-y-1">
                {hours.map((h, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{h.day}</span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3">🌐 Social Media</h3>
              <div className="space-y-2">
                <SocialLink url={instagramUrl} label={`Instagram → ${text('contact.instagram')}`} />
                <SocialLink url={facebookUrl} label={`Facebook → ${text('contact.facebook')}`} />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
