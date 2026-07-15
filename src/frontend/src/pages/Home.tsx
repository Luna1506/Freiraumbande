import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import { useContent } from '../hooks/useContent'
import { EventCard } from '../components/features/EventCard'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassButton } from '../components/ui/GlassButton'

const FEATURE_ICONS = ['🏆', '⚽', '👥']

export function Home() {
  const { events, loading } = useEvents(true)
  const { text } = useContent()

  const features = FEATURE_ICONS.map((icon, i) => ({
    icon,
    title: text(`home.feature${i + 1}.title`),
    text: text(`home.feature${i + 1}.text`),
  }))

  return (
    <div>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-24">

        <div className="max-w-3xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            textShadow: '0 1px 8px rgba(0,0,0,0.8)',
          }}>
            {text('home.kicker')}
          </p>

          <h1
              className="font-display text-7xl md:text-9xl font-bold text-white uppercase leading-none text-shadow-lg mb-6"
              style={{
                whiteSpace: 'nowrap',
                fontSize: 'clamp(2rem, 8vw, 7rem)',
                textAlign: 'center',
                width: '100%',
              }}
          >
            {text('home.title')}
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-lg mx-auto leading-relaxed mb-10 text-shadow">
            {text('home.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/kalender">
              <GlassButton className="px-7 py-3 text-base">Termine ansehen</GlassButton>
            </Link>
            <Link to="/ueber-uns">
              <GlassButton className="px-7 py-3 text-base">Über uns</GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events preview */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="font-display text-4xl font-bold text-white uppercase mb-2">
          {text('home.eventsTitle')}
        </h2>
        <div className="w-16 h-0.5 bg-white/30 mb-8" />

        {loading ? (
          <p className="text-white/50">Lade Termine…</p>
        ) : events.length === 0 ? (
          <GlassCard className="p-6 text-white/50 text-center">
            Aktuell keine anstehenden Termine.
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 3).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {events.length > 3 && (
          <div className="mt-6 text-center">
            <Link to="/kalender">
              <GlassButton>Alle Termine anzeigen</GlassButton>
            </Link>
          </div>
        )}
      </section>

      {/* Feature teaser */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(item => (
            <GlassCard key={item.icon} className="p-6 text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}
