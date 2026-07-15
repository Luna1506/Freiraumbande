import api from './api'

export type ContentMap = Record<string, string>

export const contentService = {
  getAll: async (): Promise<ContentMap> => {
    const { data } = await api.get<ContentMap>('/api/content')
    return data
  },

  update: async (entries: ContentMap): Promise<ContentMap> => {
    const { data } = await api.put<ContentMap>('/api/content', entries)
    return data
  },

  uploadBackground: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<{ url: string }>('/api/content/background', formData)
    return data.url
  },

  resetBackground: async (): Promise<void> => {
    await api.delete('/api/content/background')
  },
}
