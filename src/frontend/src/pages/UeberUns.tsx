import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { GlassCard } from '../components/ui/GlassCard'
import { ImageGallery } from '../components/features/ImageGallery'
import { galleryService } from '../services/galleryService'
import { GalleryImage } from '../types'

export function UeberUns() {
  const { isAuthenticated } = useAuth()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    galleryService.getAll().then(setImages).catch(() => {})
  }, [])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const newImage = await galleryService.upload(file)
      setImages(prev => [newImage, ...prev])
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bild wirklich löschen?')) return
    await galleryService.delete(id)
    setImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <h1 className="font-display text-6xl font-bold text-white uppercase mb-2 text-shadow">
          Über uns
        </h1>
        <div className="w-16 h-0.5 bg-white/30 mb-12" />

        {/* Wer wir sind */}
        <GlassCard className="p-8 mb-6">
          <h2 className="font-display text-2xl font-semibold text-white uppercase mb-4">
            Wer wir sind
          </h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Wir sind die <span className="text-white font-semibold">Freiraumbande</span> – ein
            leidenschaftlicher Tischfußball-Club. Unsere Mission ist es, den Kickersport in der Stadt zu fördern und eine
            offene, freundschaftliche Gemeinschaft zu schaffen, in der jeder willkommen ist.
          </p>
          <p className="text-white/75 leading-relaxed">
            Wir treffen uns regelmäßig, spielen gemeinsam und veranstalten Turniere. Bei uns zählt der Spaß am Spiel – egal ob Anfänger oder
            erfahrener Profi.
          </p>
        </GlassCard>

        {/* Geschichte */}
        <GlassCard className="p-8 mb-6">
          <h2 className="font-display text-2xl font-semibold text-white uppercase mb-4">
            Unsere Geschichte
          </h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-white/75 leading-relaxed">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        </GlassCard>

        {/* Werte */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: '🤝', title: 'Gemeinschaft', text: 'Zusammen spielen, zusammen lachen.' },
            { icon: '🎯', title: 'Fairplay', text: 'Respekt und Sportsgeist über alles.' },
            { icon: '🔥', title: 'Leidenschaft', text: 'Kicker ist mehr als ein Spiel.' },
          ].map(v => (
            <GlassCard key={v.title} className="p-5 text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <h3 className="text-white font-semibold mb-1">{v.title}</h3>
              <p className="text-white/55 text-sm">{v.text}</p>
            </GlassCard>
          ))}
        </div>

        {/* Gallery */}
        <div>
          <h2 className="font-display text-3xl font-bold text-white uppercase mb-2">Galerie</h2>
          <div className="w-16 h-0.5 bg-white/30 mb-6" />
          <ImageGallery
            images={images}
            isAdmin={isAuthenticated}
            onUpload={handleUpload}
            onDelete={handleDelete}
            uploading={uploading}
          />
        </div>
      </div>
    </div>
  )
}
