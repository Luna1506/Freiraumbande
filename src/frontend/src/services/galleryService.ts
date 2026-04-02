import api from './api'
import { GalleryImage } from '../types'

export const galleryService = {
  getAll: async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<GalleryImage[]>('/api/gallery')
    return data
  },

  upload: async (file: File): Promise<GalleryImage> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<GalleryImage>('/api/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/gallery/${id}`)
  },
}
