<script setup lang="ts">
import type { SwipeMovie } from '@/types'

defineProps<{
  movie: SwipeMovie
}>()
</script>

<template>
  <div class="flex items-center gap-4 p-2 shadow">
    <img
      v-if="movie.posterPath"
      :src="`https://image.tmdb.org/t/p/w92/${movie.posterPath}`"
      :alt="movie.title + ' poster'"
      class="w-12"
    />
    <h3 class="font-semibold">
      {{ movie.title }} ({{ new Date(movie.releaseDate).getFullYear() }})
    </h3>
  </div>
</template>
