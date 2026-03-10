<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import { feedService } from '@/services/feed.service'
import type { FeedMovie } from '@/types'

const movies = ref<FeedMovie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    movies.value = await feedService.getFeed()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load feed'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <van-loading v-if="loading" type="spinner" size="24px" vertical>Loading feed...</van-loading>

  <van-empty v-else-if="error" description="Something went wrong">
    <template #description>
      <p>{{ error }}</p>
    </template>
  </van-empty>

  <van-empty v-else-if="movies.length === 0" description="No movies in your feed yet" />

  <template v-else>
    <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
  </template>
</template>
