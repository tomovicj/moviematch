<script setup lang="ts">
import ViewHeaderBar from '@/components/ViewHeaderBar.vue'
import { swipeService } from '@/services/swipe.service'
import type { SwipeMovie, SwipeType } from '@/types'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const listType = ref<string>('')
const movies = ref<SwipeMovie[]>([])

const getMovies = async (type: SwipeType | 'ALL') => {
  try {
    const swipes = await swipeService.getSwipes(type)
    movies.value = swipes.map((swipe) => swipe.movie)
  } catch (error) {
    console.error('Error fetching swiped movies:', error)
  }
}

watch(
  () => route.query.type as string | undefined,
  (lt) => {
    const type = (lt ?? 'ALL').toUpperCase() as SwipeType | 'ALL'
    listType.value = type
    getMovies(type)
  },
  { immediate: true },
)
</script>

<template>
  <ViewHeaderBar
    :label="listType === 'ALL' ? 'All Swiped Movies' : listType.toLowerCase() + ' Movies'"
    :showBackButton="true"
  />
  <div>
    <MovieListItem v-for="movie in movies" :key="movie.id" :movie="movie" />
  </div>
</template>
