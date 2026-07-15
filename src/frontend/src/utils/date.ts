/** Lokales Datum als "YYYY-MM-DD" — bewusst ohne toISOString(), da das UTC verwendet. */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** "YYYY-MM-DD" → z. B. "Dienstag, 15. Juli 2026" */
export function formatDateLong(dateKey: string): string {
  return new Date(dateKey + 'T00:00:00').toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
