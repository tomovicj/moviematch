<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import { feedService } from '@/services/feed.service'
import type { FeedMovie } from '@/types'
import { swipeService } from '@/services/swipe.service'

const movies = ref<FeedMovie[]>([])
const currentIndex = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  await loadMovies()
})

const loadMovies = async () => {
  try {
    movies.value = await feedService.getFeed()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load feed'
  } finally {
    loading.value = false
  }
}

const toNextMovie = async () => {
  // Preload more movies when we're within 5 of the end of the list
  if (movies.value.length - currentIndex.value <= 5) {
    await loadMovies()
    if (!error.value) {
      currentIndex.value = 0
      return
    }
  }

  if (currentIndex.value < movies.value.length - 1) {
    currentIndex.value++
  }
}

const handleLike = (movieId: string) => {
  swipeService.newSwipe({ movieId, type: 'LIKE' })
  toNextMovie()
}

const handleDislike = (movieId: string) => {
  swipeService.newSwipe({ movieId, type: 'DISLIKE' })
  toNextMovie()
}

const handleWatched = (movieId: string) => {
  swipeService.newSwipe({ movieId, type: 'WATCHED' })
  toNextMovie()
}
</script>

<template>
  <!-- Loading state — centered in available space -->
  <div v-if="loading" class="h-full flex items-center justify-center">
    <van-loading type="spinner" size="24px" vertical>Loading feed...</van-loading>
  </div>

  <!-- Error state — centered -->
  <div v-else-if="error" class="h-full flex items-center justify-center">
    <van-empty description="Something went wrong">
      <template #description>
        <p>{{ error }}</p>
      </template>
    </van-empty>
  </div>

  <!-- Empty state — centered -->
  <div v-else-if="movies.length === 0" class="h-full flex items-center justify-center">
    <van-empty description="No movies in your feed yet" />
  </div>

  <!-- Feed card + action buttons -->
  <div v-else class="flex flex-col h-full px-3 pt-2 pb-1">
    <!-- Card area — fills remaining height -->
    <div class="flex-1 min-h-0">
      <MovieCard :movie="movies[currentIndex]!" />
    </div>

    <!-- Action buttons — pinned at bottom, never pushed off-screen -->
    <div class="shrink-0 flex justify-evenly py-2">
      <button
        class="active:scale-90 transition-transform"
        @click="handleDislike(movies[currentIndex]!.id)"
      >
        <van-icon name="close" size="48" class="text-red-500" />
      </button>
      <button
        class="active:scale-90 transition-transform"
        @click="handleWatched(movies[currentIndex]!.id)"
      >
        <van-icon name="add-o" size="48" class="text-blue-500" />
      </button>
      <button
        class="active:scale-90 transition-transform"
        @click="handleLike(movies[currentIndex]!.id)"
      >
        <van-icon name="passed" size="48" class="text-green-500" />
      </button>
    </div>
  </div>
</template>
