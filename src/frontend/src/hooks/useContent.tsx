import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { contentService, ContentMap } from '../services/contentService'
import { DEFAULT_CONTENT } from '../content/defaults'

interface ContentContextValue {
  /** Nur die im Backend überschriebenen Werte. */
  overrides: ContentMap
  /** Liefert den Text zu einem Key — Override oder Default. */
  text: (key: string) => string
  loading: boolean
  refresh: () => Promise<void>
}

const ContentContext = createContext<ContentContextValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<ContentMap>({})
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setOverrides(await contentService.getAll())
    } catch {
      // Backend nicht erreichbar → Defaults verwenden
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    contentService
      .getAll()
      .then(data => {
        if (!cancelled) setOverrides(data)
      })
      .catch(() => {
        // Backend nicht erreichbar → Defaults verwenden
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const text = useCallback(
    (key: string) => overrides[key] ?? DEFAULT_CONTENT[key] ?? '',
    [overrides]
  )

  return (
    <ContentContext.Provider value={{ overrides, text, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- Context-Hook gehört zum Provider
export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent muss innerhalb von ContentProvider verwendet werden')
  return ctx
}
