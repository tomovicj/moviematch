import axios from 'axios'
import type { ApiError } from '@/types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError =
      axios.isAxiosError(error) && error.response?.data
        ? (error.response.data as ApiError)
        : {
            error: {
              message: error.message ?? 'Unknown error',
              status: error.response?.status ?? 500,
            },
          }

    return Promise.reject(apiError)
  },
)
