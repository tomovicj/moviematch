<script setup lang="ts">
import type { SwipeMovie } from '@/types'

defineProps<{
  label: string
  movies: SwipeMovie[]
}>()
</script>

<template>
  <div class="shadow p-4">
    <div class="flex items-center justify-between">
      <h2>{{ label }}</h2>
      <span class="text-sm text-gray-500"
        >{{ movies.length }} {{ movies.length === 1 ? 'movie' : 'movies' }}</span
      >
    </div>
    <div class="flex flex-row p-0 m-0 gap-0 overflow-hidden">
      <div v-for="movie in movies" :key="movie.id" class="w-14 flex-shrink-0">
        <img
          v-if="movie.posterPath"
          :src="`https://image.tmdb.org/t/p/w92${movie.posterPath}`"
          :alt="movie.title"
        />
      </div>
    </div>
  </div>
</template>
