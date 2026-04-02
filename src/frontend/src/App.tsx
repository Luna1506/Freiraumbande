import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { Navbar } from './components/ui/Navbar'
import { Home } from './pages/Home'
import { UeberUns } from './pages/UeberUns'
import { Kalender } from './pages/Kalender'
import { Kontakt } from './pages/Kontakt'
import { Admin } from './pages/Admin'
import heroImg from './assets/hero.jpg'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Fixed full-screen background */}
        <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: -2,
              backgroundImage: `url(${heroImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
        />
        {/* Dark overlay for readability */}
        <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: -1,
              background: 'rgba(0,0,0,0.38)',
            }}
        />

        <Navbar />

        <main style={{ position: 'relative', paddingTop: '80px', paddingBottom: '16px' }}>
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
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <ScrollArrow />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
