import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useContent } from '../hooks/useContent'
import { GlassCard } from '../components/ui/GlassCard'
import { ImageGallery } from '../components/features/ImageGallery'
import { MemberGrid } from '../components/features/MemberGrid'
import { galleryService } from '../services/galleryService'
import { memberService } from '../services/memberService'
import { GalleryImage, Member } from '../types'

const VALUE_ICONS = ['🤝', '🎯', '🔥']

export function UeberUns() {
  const { isAuthenticated } = useAuth()
  const { text } = useContent()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    galleryService.getAll().then(setImages).catch(() => {})
    memberService.getAll().then(setMembers).catch(() => {})
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

  const values = VALUE_ICONS.map((icon, i) => ({
    icon,
    title: text(`about.value${i + 1}.title`),
    text: text(`about.value${i + 1}.text`),
  }))

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
          <p className="text-white/75 leading-relaxed mb-4 whitespace-pre-line">
            {text('about.who1')}
          </p>
          <p className="text-white/75 leading-relaxed whitespace-pre-line">
            {text('about.who2')}
          </p>
        </GlassCard>

        {/* Geschichte */}
        <GlassCard className="p-8 mb-6">
          <h2 className="font-display text-2xl font-semibold text-white uppercase mb-4">
            Unsere Geschichte
          </h2>
          <p className="text-white/75 leading-relaxed mb-4 whitespace-pre-line">
            {text('about.history1')}
          </p>
          <p className="text-white/75 leading-relaxed whitespace-pre-line">
            {text('about.history2')}
          </p>
        </GlassCard>

        {/* Werte */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {values.map(v => (
            <GlassCard key={v.icon} className="p-5 text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <h3 className="text-white font-semibold mb-1">{v.title}</h3>
              <p className="text-white/55 text-sm">{v.text}</p>
            </GlassCard>
          ))}
        </div>

        {/* Mitglieder — verwaltet wird im Admin-Bereich (Tab „Mitglieder") */}
        <div className="mb-12">
          <h2 className="font-display text-3xl font-bold text-white uppercase mb-2">
            Unsere Mitglieder
          </h2>
          <div className="w-16 h-0.5 bg-white/30 mb-6" />
          <MemberGrid members={members} />
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
