import api from './api'
import { Member } from '../types'

export interface MemberFormData {
  name: string
  role?: string
  /** Optional — beim Bearbeiten heißt leer: Foto behalten. */
  file?: File
  /** Entfernt beim Bearbeiten das vorhandene Foto (wird von file übersteuert). */
  removePhoto?: boolean
}

function toFormData({ name, role, file, removePhoto }: MemberFormData): FormData {
  const formData = new FormData()
  formData.append('name', name)
  if (role) formData.append('role', role)
  if (file) formData.append('file', file)
  if (removePhoto) formData.append('removePhoto', 'true')
  return formData
}

export const memberService = {
  getAll: async (): Promise<Member[]> => {
    const { data } = await api.get<Member[]>('/api/members')
    return data
  },

  create: async (member: MemberFormData): Promise<Member> => {
    const { data } = await api.post<Member>('/api/members', toFormData(member), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  update: async (id: number, member: MemberFormData): Promise<Member> => {
    const { data } = await api.put<Member>(`/api/members/${id}`, toFormData(member), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/members/${id}`)
  },
}
