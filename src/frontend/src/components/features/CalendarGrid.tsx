import { useMemo, useState } from 'react'
import { Event } from '../../types'
import { GlassCard } from '../ui/GlassCard'
import { toDateKey, formatDateLong } from '../../utils/date'

interface CalendarGridProps {
  events: Event[]
  selectedDate: string | null
  onSelectDate: (date: string | null) => void
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

interface DayCell {
  key: string
  day: number
  inMonth: boolean
}

/** Alle Zellen des Monatsrasters (Wochen beginnen montags). */
function buildMonthCells(year: number, month: number): DayCell[] {
  const first = new Date(year, month, 1)
  // getDay(): So=0 … Sa=6 → Offset für Montag als Wochenstart
  const leading = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const total = Math.ceil((leading + daysInMonth) / 7) * 7

  const cells: DayCell[] = []
  for (let i = 0; i < total; i++) {
    const date = new Date(year, month, 1 - leading + i)
    cells.push({
      key: toDateKey(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    })
  }
  return cells
}

export function CalendarGrid({ events, selectedDate, onSelectDate }: CalendarGridProps) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const todayKey = toDateKey(now)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>()
    for (const event of events) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    return map
  }, [events])

  const cells = useMemo(() => buildMonthCells(viewYear, viewMonth), [viewYear, viewMonth])

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  })

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const goToToday = () => {
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    onSelectDate(todayKey)
  }

  return (
    <GlassCard className="p-4 sm:p-6">
      {/* Header: Monat + Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-white capitalize">
          {monthLabel}
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToToday}
            className="text-xs text-white/60 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 transition-colors cursor-pointer"
          >
            Heute
          </button>
          <button
            onClick={() => shiftMonth(-1)}
            aria-label="Vorheriger Monat"
            className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8 rounded-lg border border-white/15 transition-colors cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={() => shiftMonth(1)}
            aria-label="Nächster Monat"
            className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8 rounded-lg border border-white/15 transition-colors cursor-pointer"
          >
            ›
          </button>
        </div>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-[11px] font-semibold uppercase tracking-wider text-white/40 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Tage */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map(cell => {
          const dayEvents = eventsByDate.get(cell.key) ?? []
          const isToday = cell.key === todayKey
          const isSelected = cell.key === selectedDate

          return (
            <button
              key={cell.key}
              onClick={() => onSelectDate(isSelected ? null : cell.key)}
              aria-label={`${formatDateLong(cell.key)}${
                dayEvents.length > 0 ? `, ${dayEvents.length} Termin${dayEvents.length > 1 ? 'e' : ''}` : ''
              }`}
              aria-pressed={isSelected}
              className={`
                relative aspect-square rounded-xl text-sm transition-all cursor-pointer
                flex flex-col items-center justify-center gap-0.5
                ${cell.inMonth ? 'text-white/80' : 'text-white/25'}
                ${isSelected
                  ? 'bg-white/25 border border-white/40 text-white'
                  : isToday
                    ? 'bg-white/10 border border-white/30'
                    : 'border border-transparent hover:bg-white/10'}
              `}
            >
              <span className={isToday ? 'font-bold' : ''}>{cell.day}</span>
              {dayEvents.length > 0 && (
                <span className="flex gap-0.5" aria-hidden="true">
                  {dayEvents.slice(0, 3).map(event => (
                    <span
                      key={event.id}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-300/90"
                    />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legende */}
      <div className="flex items-center gap-2 mt-4 text-white/40 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300/90" />
        Termin — Tag antippen für Details
      </div>
    </GlassCard>
  )
}
