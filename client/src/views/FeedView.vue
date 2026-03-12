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
    <div class="flex flex-col h-full">
      <div class="flex-1 min-h-0">
        <MovieCard :movie="movies[0]!" />
      </div>
      <div class="flex justify-evenly my-4">
        <button>
          <van-icon name="close" size="60" class="text-red-500" />
        </button>
        <button>
          <van-icon name="add-o" size="60" class="text-blue-500" />
        </button>
        <button>
          <van-icon name="passed" size="60" class="text-green-500" />
        </button>
      </div>
    </div>
  </template>
</template>
