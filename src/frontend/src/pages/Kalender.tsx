import { useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/features/EventCard'
import { CalendarGrid } from '../components/features/CalendarGrid'
import { GlassCard } from '../components/ui/GlassCard'
import { toDateKey, formatDateLong } from '../utils/date'

export function Kalender() {
  const { events, loading, error } = useEvents()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showPast, setShowPast] = useState(false)

  const today = toDateKey()
  const upcoming = events.filter(e => e.date >= today)
  const past = events.filter(e => e.date < today)
  const selectedEvents = selectedDate ? events.filter(e => e.date === selectedDate) : []

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
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
            {/* Monatsansicht + Tages-Panel */}
            <div className="grid lg:grid-cols-[3fr_2fr] gap-6 mb-12 items-start">
              <CalendarGrid
                events={events}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />

              <div className="space-y-3">
                {selectedDate ? (
                  <>
                    <h2 className="text-white font-semibold text-lg">
                      {formatDateLong(selectedDate)}
                    </h2>
                    {selectedEvents.length === 0 ? (
                      <GlassCard className="p-6 text-white/50 text-center">
                        Keine Termine an diesem Tag.
                      </GlassCard>
                    ) : (
                      selectedEvents.map(event => <EventCard key={event.id} event={event} />)
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-white font-semibold text-lg">Nächste Termine</h2>
                    {upcoming.length === 0 ? (
                      <GlassCard className="p-6 text-white/50 text-center">
                        Aktuell keine anstehenden Termine.
                      </GlassCard>
                    ) : (
                      upcoming.slice(0, 3).map(event => <EventCard key={event.id} event={event} />)
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Alle anstehenden Termine */}
            <section className="mb-12">
              <h2 className="text-white font-semibold text-lg mb-4">Alle anstehenden Termine</h2>
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

            {/* Vergangene Termine (einklappbar) */}
            {past.length > 0 && (
              <section>
                <button
                  onClick={() => setShowPast(s => !s)}
                  className="text-white/50 font-semibold text-lg mb-4 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                  Vergangene Termine
                  <span className="text-sm">{showPast ? '▲' : '▼'}</span>
                </button>
                {showPast && (
                  <div className="space-y-3 opacity-60">
                    {[...past].reverse().map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
