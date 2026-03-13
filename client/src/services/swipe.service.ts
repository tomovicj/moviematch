import { apiClient } from '@/lib/axios'
import type { Swipe, SwipeType, SwipeWithMovie } from '@/types'

export const swipeService = {
  async newSwipe(swipeData: { movieId: string; type: SwipeType }) {
    const { data } = await apiClient.post<Swipe>('/api/swipes', swipeData)
    return data
  },

  async getSwipes(type: SwipeType | 'ALL' = 'ALL') {
    switch (type) {
      case 'LIKE':
        return (await apiClient.get<SwipeWithMovie[]>('/api/swipes/liked')).data
      case 'DISLIKE':
        return (await apiClient.get<SwipeWithMovie[]>('/api/swipes/disliked')).data
      case 'WATCHED':
        return (await apiClient.get<SwipeWithMovie[]>('/api/swipes/watched')).data
      default:
        return (await apiClient.get<SwipeWithMovie[]>('/api/swipes')).data
    }
  },
}
