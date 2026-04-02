import { FormEvent } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassButton } from '../components/ui/GlassButton'

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/35 focus:outline-none focus:border-white/45 focus:bg-white/15 transition-colors text-sm'

export function Kontakt() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = encodeURIComponent(data.get('name') as string)
    const email = encodeURIComponent(data.get('email') as string)
    const message = encodeURIComponent(data.get('message') as string)
    window.location.href =
      `mailto:info@freiraumbande.de?subject=Nachricht%20von%20${name}&body=${message}%0A%0AAntwort%20an%3A%20${email}`
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
                required
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                placeholder="E-Mail-Adresse *"
                required
                className={inputClass}
              />
              <textarea
                name="message"
                placeholder="Deine Nachricht *"
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
              <p className="text-white/65 text-sm leading-relaxed">
                Jahnstraße 3a<br />
                17033 Neubrandenburg
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                ✉️ E-Mail
              </h3>
              <a
                href="mailto:info@freiraumbande.de"
                className="text-white/65 text-sm hover:text-white transition-colors"
              >
                info@freiraumbande.de
              </a>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3">🕐 Trainings- und Spielzeiten</h3>
              <div className="text-white/65 text-sm space-y-1">
                <div className="flex justify-between"><span>Dienstag</span><span>18:00 – 20:00</span></div>
                <div className="flex justify-between"><span>Mittwoch</span><span>18:00 – 20:00</span></div>
                <div className="flex justify-between"><span>Donnerstag</span><span>18:00 – 20:00</span></div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3">🌐 Social Media</h3>
              <div className="space-y-2">
                {/* FUTURE: Replace with real social media links */}
                <a href="#" className="block text-white/65 text-sm hover:text-white transition-colors">
                  Instagram → @freiraumbande
                </a>
                <a href="#" className="block text-white/65 text-sm hover:text-white transition-colors">
                  Facebook → Freiraumbande
                </a>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
