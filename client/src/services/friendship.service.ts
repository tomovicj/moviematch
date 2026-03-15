import { apiClient } from '@/lib/axios'
import type { FriendItem, FriendshipWithUsers, PendingRequest, SentRequest } from '@/types'

export const friendshipService = {
  async getFriends(): Promise<FriendItem[]> {
    const { data } = await apiClient.get<FriendItem[]>('/api/friendships')
    return data
  },

  async getReceivedFriendRequests(): Promise<PendingRequest[]> {
    const { data } = await apiClient.get<PendingRequest[]>('/api/friendships/requests/pending')
    return data
  },

  async getSentFriendRequests(): Promise<SentRequest[]> {
    const { data } = await apiClient.get<SentRequest[]>('/api/friendships/requests/sent')
    return data
  },

  async acceptRequest(requestId: string): Promise<FriendshipWithUsers> {
    const { data } = await apiClient.post<FriendshipWithUsers>(
      `/api/friendships/request/${requestId}/accept`,
    )
    return data
  },

  async rejectRequest(requestId: string): Promise<FriendshipWithUsers> {
    const { data } = await apiClient.post<FriendshipWithUsers>(
      `/api/friendships/request/${requestId}/reject`,
    )
    return data
  },

  async cancelRequest(requestId: string): Promise<void> {
    await apiClient.delete(`/api/friendships/requests/sent/${requestId}`)
  },
}
