<script setup lang="ts">
import type { FeedMovie } from '@/types'

defineProps<{
  movie?: FeedMovie
}>()
</script>

<template>
  <div class="h-full flex flex-col rounded-lg overflow-hidden border border-gray-300">
    <!-- Poster area — fills available vertical space -->
    <div
      v-if="movie?.posterPath"
      class="flex-1 min-h-0 bg-center bg-cover bg-no-repeat"
      :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/w780${movie.posterPath})` }"
      role="img"
      :aria-label="`${movie.title} poster`"
    ></div>
    <div
      v-else-if="movie"
      class="flex-1 min-h-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm"
    >
      No poster available
    </div>
    <div v-else class="flex-1 min-h-0 flex items-center justify-center bg-gray-300">
      <span class="text-6xl text-gray-500 font-bold">?</span>
    </div>

    <!-- Info panel — compact, never grows -->
    <div class="shrink-0 p-3">
      <template v-if="movie">
        <h2 class="text-base font-semibold leading-tight mb-1 line-clamp-2">
          {{ movie.title }} ({{ new Date(movie.releaseDate).getFullYear() }})
        </h2>

        <div class="flex items-center gap-2 mb-1">
          <van-rate
            :model-value="movie.voteAverage / 2"
            allow-half
            readonly
            size="12"
            void-icon="star"
          />
          <span class="text-xs text-gray-600">
            {{ (movie.voteAverage / 2).toFixed(1) }} / 5 ({{ movie.voteCount }})
          </span>
        </div>

        <!-- <p class="text-xs text-gray-600 mb-1">{{ formatDate(movie.releaseDate) }}</p> -->

        <div class="flex gap-1 mb-1 flex-wrap">
          <span
            class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-200 text-gray-800 text-nowrap"
            v-for="genre in movie.genres"
            :key="genre.name"
          >
            {{ genre.name }}
          </span>
        </div>

        <p class="text-gray-700 text-xs leading-snug max-h-16 overflow-y-auto">
          {{ movie.overview }}
        </p>
      </template>
      <template v-else>
        <van-skeleton title :row-height="4" class="mb-2" />
        <div class="flex items-center gap-2 mb-2">
          <van-skeleton :row="0" :row-width="[60]" />
          <van-skeleton :row="0" :row-width="[40]" />
        </div>
        <div class="flex gap-1 mb-2">
          <van-skeleton :row="0" :row-width="[50, 60, 45]" />
        </div>
        <van-skeleton :row="3" :row-height="[12, 12, 12]" />
      </template>
    </div>
  </div>
</template>
