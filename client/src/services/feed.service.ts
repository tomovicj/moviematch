import { apiClient } from '@/lib/axios'
import type { FeedMovie } from '@/types'

export const feedService = {
  async getFeed(): Promise<FeedMovie[]> {
    const { data } = await apiClient.get<FeedMovie[]>('/api/movies/feed')
    return data
  },
}
