import api from './api'
import { Event, CreateEventRequest } from '../types'

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const { data } = await api.get<Event[]>('/api/events')
    return data
  },

  getById: async (id: number): Promise<Event> => {
    const { data } = await api.get<Event>(`/api/events/${id}`)
    return data
  },

  create: async (request: CreateEventRequest): Promise<Event> => {
    const { data } = await api.post<Event>('/api/events', request)
    return data
  },

  update: async (id: number, request: CreateEventRequest): Promise<Event> => {
    const { data } = await api.put<Event>(`/api/events/${id}`, request)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/events/${id}`)
  },
}
