export interface Event {
  id: number
  title: string
  description?: string
  date: string       // "YYYY-MM-DD"
  time?: string      // "HH:mm:ss"
  location?: string
  createdAt: string
}

export interface CreateEventRequest {
  title: string
  description?: string
  date: string
  time?: string
  location?: string
}

export interface GalleryImage {
  id: number
  url: string
  originalName: string
  uploadedAt: string
}

export interface LoginResponse {
  accessToken: string
}
