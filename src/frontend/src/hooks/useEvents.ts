import { useState, useEffect, useCallback } from 'react'
import { Event } from '../types'
import { eventService } from '../services/eventService'
import { toDateKey } from '../utils/date'

export function useEvents(upcomingOnly = false) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    eventService
      .getAll()
      .then(data => {
        if (cancelled) return
        const sorted = [...data].sort((a, b) => {
          const cmp = a.date.localeCompare(b.date)
          if (cmp !== 0) return cmp
          return (a.time ?? '').localeCompare(b.time ?? '')
        })
        if (upcomingOnly) {
          const today = toDateKey()
          setEvents(sorted.filter(e => e.date >= today))
        } else {
          setEvents(sorted)
        }
        setError(null)
      })
      .catch(() => {
        if (!cancelled) setError('Fehler beim Laden der Termine')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey, upcomingOnly])

  const refresh = useCallback(() => {
    setLoading(true)
    setError(null)
    setRefreshKey(k => k + 1)
  }, [])

  return { events, loading, error, refresh }
}
