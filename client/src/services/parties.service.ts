import { apiClient } from '@/lib/axios'
import type { Party } from '@/types'

export const partiesService = {
  async getParties() {
    const { data } = await apiClient.get<Party[]>('/api/parties')
    return data
  },

  async getParty(id: string) {
    const { data } = await apiClient.get<Party>(`/api/parties/${id}`)
    return data
  },

  async createParty(name: string) {
    const { data } = await apiClient.post<Party>('/api/parties', { name })
    return data
  },

  async deleteParty(id: string) {
    const { data } = await apiClient.delete<Party>(`/api/parties/${id}`)
    return data
  },
}
