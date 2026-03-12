import { apiClient } from '@/lib/axios'
import type { Swipe, SwipeType } from '@/types'

export const swipeService = {
  async newSwipe(swipeData: { movieId: string; type: SwipeType }) {
    const { data } = await apiClient.post<Swipe>('/api/swipes', swipeData)
    return data
  },
}
