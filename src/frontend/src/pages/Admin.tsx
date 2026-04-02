import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useEvents } from '../hooks/useEvents'
import { GlassCard } from '../components/ui/GlassCard'
import { GlassButton } from '../components/ui/GlassButton'
import { EventCard } from '../components/features/EventCard'
import { AdminEventForm } from '../components/features/AdminEventForm'
import { ImageGallery } from '../components/features/ImageGallery'
import { eventService } from '../services/eventService'
import { galleryService } from '../services/galleryService'
import { Event, CreateEventRequest, GalleryImage } from '../types'

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/35 focus:outline-none focus:border-white/45 transition-colors'

// ── Login Form ──────────────────────────────────────────────────────────────

function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setLoading(true)
    setError('')
    try {
      await login(data.get('username') as string, data.get('password') as string)
    } catch {
      setError('Ungültige Anmeldedaten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <GlassCard className="p-8 w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold text-white uppercase mb-6">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Benutzername"
            required
            autoComplete="username"
            className={inputClass}
          />
          <input
            type="password"
            name="password"
            placeholder="Passwort"
            required
            autoComplete="current-password"
            className={inputClass}
          />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <GlassButton type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Anmelden…' : 'Anmelden'}
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  )
}

// ── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { logout } = useAuth()
  const { events, loading: eventsLoading, refresh: refreshEvents } = useEvents()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'events' | 'gallery'>('events')

  useEffect(() => {
    galleryService.getAll().then(setImages).catch(() => {})
  }, [])

  const handleSaveEvent = async (data: CreateEventRequest) => {
    if (editingEvent) {
      await eventService.update(editingEvent.id, data)
      setEditingEvent(null)
    } else {
      await eventService.create(data)
      setShowNewForm(false)
    }
    refreshEvents()
  }

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Termin wirklich löschen?')) return
    await eventService.delete(id)
    refreshEvents()
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const img = await galleryService.upload(file)
      setImages(prev => [img, ...prev])
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Bild wirklich löschen?')) return
    await galleryService.delete(id)
    setImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white uppercase">Dashboard</h1>
            <p className="text-white/50 text-sm mt-1">Freiraumbande Admin</p>
          </div>
          <GlassButton variant="danger" onClick={logout}>Abmelden</GlassButton>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['events', 'gallery'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'events' ? '📅 Termine' : '🖼️ Galerie'}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg">Termine verwalten</h2>
              {!showNewForm && !editingEvent && (
                <GlassButton variant="success" onClick={() => setShowNewForm(true)}>
                  + Neuer Termin
                </GlassButton>
              )}
            </div>

            {showNewForm && !editingEvent && (
              <div className="mb-4">
                <AdminEventForm
                  onSave={handleSaveEvent}
                  onCancel={() => setShowNewForm(false)}
                />
              </div>
            )}

            {eventsLoading ? (
              <p className="text-white/50">Lade…</p>
            ) : events.length === 0 && !showNewForm ? (
              <GlassCard className="p-6 text-white/50 text-center">
                Noch keine Termine vorhanden.
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {events.map(event =>
                  editingEvent?.id === event.id ? (
                    <AdminEventForm
                      key={event.id}
                      event={editingEvent}
                      onSave={handleSaveEvent}
                      onCancel={() => setEditingEvent(null)}
                    />
                  ) : (
                    <EventCard
                      key={event.id}
                      event={event}
                      isAdmin
                      onEdit={e => { setEditingEvent(e); setShowNewForm(false) }}
                      onDelete={handleDeleteEvent}
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <section>
            <h2 className="text-white font-semibold text-lg mb-4">Galerie verwalten</h2>
            <ImageGallery
              images={images}
              isAdmin
              onUpload={handleUpload}
              onDelete={handleDeleteImage}
              uploading={uploading}
            />
          </section>
        )}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function Admin() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Dashboard /> : <LoginForm />
}
