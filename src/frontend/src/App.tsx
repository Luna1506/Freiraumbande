import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider } from './hooks/useAuth'
import { ContentProvider, useContent } from './hooks/useContent'
import { BACKGROUND_KEY } from './content/defaults'
import { Navbar } from './components/ui/Navbar'
import { Footer } from './components/ui/Footer'
import { Home } from './pages/Home'
import { UeberUns } from './pages/UeberUns'
import { Kalender } from './pages/Kalender'
import { Kontakt } from './pages/Kontakt'
import { Impressum } from './pages/Impressum'
import { Admin } from './pages/Admin'
import heroImg from './assets/hero.jpg'

function ScrollArrow() {
  const location = useLocation()
  const [showArrow, setShowArrow] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      setShowArrow(total > window.innerHeight && scrolled < total - 50)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname]) // ← bei Route-Wechsel neu prüfen

  if (!showArrow) return null

  return (
      <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.25rem',
            pointerEvents: 'none',
            animation: 'bounce 1s infinite',
          }}
      >
        ↓
      </div>
  )
}

/**
 * Vollflächiger Hintergrund — nutzt das im Admin-Panel gesetzte Bild, sonst den Standard.
 * Liegt als background-image direkt auf dem <body> (statt in einem fixed-Div),
 * weil Firefox fixed positionierte Ebenen nicht in den backdrop-filter der
 * Glass-Elemente einbezieht — auf dem body blurrt es jeder Browser.
 */
function AppBackground() {
  const { text } = useContent()
  const customBackground = text(BACKGROUND_KEY)
  // Erst umschalten, wenn das eigene Bild fertig geladen ist — sonst flackert
  // beim Wechsel vom Standard-Hero eine leere Fläche auf
  const [readyBackground, setReadyBackground] = useState<string | null>(null)

  useEffect(() => {
    if (!customBackground) return
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (!cancelled) setReadyBackground(customBackground)
    }
    img.onerror = () => {
      // Bild-URL kaputt (z. B. Datei gelöscht) → beim Standard bleiben
      if (!cancelled) setReadyBackground(null)
    }
    img.src = customBackground
    return () => {
      cancelled = true
    }
  }, [customBackground])

  // Ohne eigenes Bild sofort der Standard; mit eigenem Bild erst nach fertigem
  // Laden umschalten (bis dahin bleibt das zuletzt sichtbare Bild stehen)
  const backgroundImage = customBackground && readyBackground ? readyBackground : heroImg

  useEffect(() => {
    // Abdunklungs-Overlay als oberste Verlaufsebene, damit kein extra Div nötig ist
    document.body.style.backgroundImage =
      `linear-gradient(rgba(0,0,0,0.38), rgba(0,0,0,0.38)), url(${backgroundImage})`
    // Dieselbe Bildquelle für die Frosted-Glass-Ebene der Glass-Elemente (siehe index.css)
    document.documentElement.style.setProperty('--bg-image', `url("${backgroundImage}")`)
    return () => {
      document.body.style.backgroundImage = ''
    }
  }, [backgroundImage])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <AppBackground />
          <Navbar />

          <main style={{ position: 'relative', paddingTop: '80px', paddingBottom: '16px', flex: '1 1 auto' }}>
            <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '90%',
                  maxWidth: '1100px',
                  height: 'calc(100% - 112px)',  // 96px oben + 16px unten
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '1.5rem',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ueber-uns" element={<UeberUns />} />
              <Route path="/kalender" element={<Kalender />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <Footer />
          <ScrollArrow />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
