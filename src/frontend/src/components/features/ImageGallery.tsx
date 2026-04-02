import { useRef, ChangeEvent } from 'react'
import { GalleryImage } from '../../types'
import { GlassButton } from '../ui/GlassButton'
import { GlassCard } from '../ui/GlassCard'

interface ImageGalleryProps {
  images: GalleryImage[]
  isAdmin?: boolean
  onUpload?: (file: File) => Promise<void>
  onDelete?: (id: number) => Promise<void>
  uploading?: boolean
}

export function ImageGallery({ images, isAdmin, onUpload, onDelete, uploading }: ImageGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload?.(file)
      e.target.value = ''
    }
  }

  if (images.length === 0 && !isAdmin) {
    return (
      <GlassCard className="p-6 text-white/50 text-center">
        Noch keine Bilder vorhanden.
      </GlassCard>
    )
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <GlassButton
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="success"
          >
            {uploading ? 'Hochladen…' : '+ Bild hochladen'}
          </GlassButton>
        </div>
      )}

      {images.length === 0 ? (
        <GlassCard className="p-6 text-white/50 text-center">Noch keine Bilder vorhanden.</GlassCard>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(image => (
            <div key={image.id} className="relative group rounded-xl overflow-hidden aspect-square">
              <img
                src={image.url}
                alt={image.originalName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {isAdmin && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <GlassButton
                    variant="danger"
                    className="text-xs px-3 py-1.5"
                    onClick={() => onDelete?.(image.id)}
                  >
                    Löschen
                  </GlassButton>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
