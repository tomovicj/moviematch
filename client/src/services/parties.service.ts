import { apiClient } from '@/lib/axios'
import type { MessageResponse, Party, PartyInvitation, PartyMatch, PartyMember } from '@/types'
import { friendshipService } from './friendship.service'

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

  async getPartyMembers(id: string) {
    const { data } = await apiClient.get<PartyMember[]>(`/api/parties/${id}/members`)
    return data
  },

  async kickMember(partyId: string, memberId: string) {
    await apiClient.post(`/api/parties/${partyId}/kick`, { userId: memberId })
  },

  async getAvailableFriends(partyId: string) {
    const friendships = await friendshipService.getFriends()
    const partyMembers = await this.getPartyMembers(partyId)
    const partyMemberIds = new Set(partyMembers.map((member) => member.id))
    return friendships.filter((friendship) => !partyMemberIds.has(friendship.friend.id))
  },

  async inviteFriend(partyId: string, friendId: string) {
    await apiClient.post<MessageResponse>(`/api/parties/${partyId}/invite`, { userId: friendId })
  },

  async getInvitations() {
    const { data } = await apiClient.get<PartyInvitation[]>(`/api/parties/invitations`)
    return data
  },

  async acceptInvitation(invitationId: string) {
    await apiClient.post<MessageResponse>(`/api/parties/invitations/${invitationId}/respond/accept`)
  },

  async declineInvitation(invitationId: string) {
    await apiClient.post<MessageResponse>(
      `/api/parties/invitations/${invitationId}/respond/decline`,
    )
  },

  async leaveParty(partyId: string) {
    await apiClient.delete<MessageResponse>(`/api/parties/${partyId}/leave`)
  },

  async getMatchingMovies(partyId: string) {
    const { data } = await apiClient.get<PartyMatch[]>(`/api/parties/${partyId}/matches`)
    return data
  },
}
