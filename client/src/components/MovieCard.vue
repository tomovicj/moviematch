<script setup lang="ts">
import type { FeedMovie } from '@/types'
import { formatDate } from '@/utils/date.util'

defineProps<{
  movie: FeedMovie
}>()
</script>

<template>
  <div
    class="border border-gray-300 rounded-lg overflow-hidden w-3/4 md:w-1/2 lg:w-1/3 mx-auto mt-4"
  >
    <img
      :src="`https://image.tmdb.org/t/p/w342${movie.posterPath}`"
      :alt="`${movie.title} poster`"
    />
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-2">{{ movie.title }}</h2>
      <p class="text-sm text-gray-600 mb-1">Release Date: {{ formatDate(movie.releaseDate) }}</p>
      <p class="mb-1">
        <van-rate
          :model-value="movie.voteAverage / 2"
          allow-half
          readonly
          size="12"
          void-icon="star"
        />
        <span class="ml-2 text-sm text-gray-600"
          >{{ (movie.voteAverage / 2).toFixed(1) }} / 5 ({{ movie.voteCount }} votes)</span
        >
      </p>
      <p class="flex gap-1 mb-1 flex-wrap">
        <span
          class="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 inline-flex items-center text-nowrap"
          v-for="genre in movie.genres"
          :key="genre.name"
          >{{ genre.name }}</span
        >
      </p>
      <p class="text-gray-700 text-xs mt-2 max-h-24 overflow-y-auto">
        {{ movie.overview }}
      </p>
    </div>
  </div>
</template>
