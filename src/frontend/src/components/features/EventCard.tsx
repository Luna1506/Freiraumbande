import { Event } from '../../types'
import { GlassCard } from '../ui/GlassCard'
import { GlassButton } from '../ui/GlassButton'

interface EventCardProps {
  event: Event
  isAdmin?: boolean
  onEdit?: (event: Event) => void
  onDelete?: (id: number) => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return ''
  return timeStr.slice(0, 5) + ' Uhr'
}

export function EventCard({ event, isAdmin, onEdit, onDelete }: EventCardProps) {
  return (
    <GlassCard className="p-5 hover:bg-white/12 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Date badge */}
        <div className="flex-shrink-0 text-center glass rounded-xl px-3 py-2 min-w-[56px]">
          <div className="text-2xl font-display font-bold leading-none text-white">
            {new Date(event.date + 'T00:00:00').getDate()}
          </div>
          <div className="text-xs text-white/60 mt-0.5 uppercase tracking-wide">
            {new Date(event.date + 'T00:00:00').toLocaleDateString('de-DE', { month: 'short' })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base leading-snug">{event.title}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
            <span className="text-white/55 text-xs">{formatDate(event.date)}</span>
            {event.time && <span className="text-white/55 text-xs">🕐 {formatTime(event.time)}</span>}
            {event.location && <span className="text-white/55 text-xs">📍 {event.location}</span>}
          </div>
          {event.description && (
            <p className="text-white/70 text-sm mt-2 leading-relaxed">{event.description}</p>
          )}
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div className="flex gap-2 flex-shrink-0">
            <GlassButton className="text-xs px-3 py-1.5" onClick={() => onEdit?.(event)}>
              Bearbeiten
            </GlassButton>
            <GlassButton variant="danger" className="text-xs px-3 py-1.5" onClick={() => onDelete?.(event.id)}>
              Löschen
            </GlassButton>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
