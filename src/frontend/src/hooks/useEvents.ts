import { useState, useEffect, useCallback } from 'react'
import { Event } from '../types'
import { eventService } from '../services/eventService'

export function useEvents(upcomingOnly = false) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    eventService
      .getAll()
      .then(data => {
        const sorted = [...data].sort((a, b) => {
          const cmp = a.date.localeCompare(b.date)
          if (cmp !== 0) return cmp
          return (a.time ?? '').localeCompare(b.time ?? '')
        })
        if (upcomingOnly) {
          const today = new Date().toISOString().split('T')[0]
          setEvents(sorted.filter(e => e.date >= today))
        } else {
          setEvents(sorted)
        }
      })
      .catch(() => setError('Fehler beim Laden der Termine'))
      .finally(() => setLoading(false))
  }, [refreshKey, upcomingOnly])

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  return { events, loading, error, refresh }
}
