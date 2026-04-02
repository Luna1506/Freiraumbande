import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/features/EventCard'
import { GlassCard } from '../components/ui/GlassCard'

export function Kalender() {
  const { events, loading, error } = useEvents()

  const today = new Date().toISOString().split('T')[0]
  const upcoming = events.filter(e => e.date >= today)
  const past = events.filter(e => e.date < today)

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-6xl font-bold text-white uppercase mb-2 text-shadow">
          Kalender
        </h1>
        <div className="w-16 h-0.5 bg-white/30 mb-12" />

        {loading && <p className="text-white/50">Lade Termine…</p>}

        {error && (
          <GlassCard className="p-5 text-red-300 mb-6">
            {error}
          </GlassCard>
        )}

        {!loading && !error && (
          <>
            {/* Upcoming */}
            <section className="mb-12">
              <h2 className="text-white font-semibold text-lg mb-4">Anstehende Termine</h2>
              {upcoming.length === 0 ? (
                <GlassCard className="p-6 text-white/50 text-center">
                  Aktuell keine anstehenden Termine.
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {upcoming.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            {past.length > 0 && (
              <section>
                <h2 className="text-white/50 font-semibold text-lg mb-4">Vergangene Termine</h2>
                <div className="space-y-3 opacity-60">
                  {[...past].reverse().map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
