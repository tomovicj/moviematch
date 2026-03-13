<script setup lang="ts">
import SwipedMoviesCard from '@/components/SwipedMoviesCard.vue'
import UserDetails from '@/components/UserDetails.vue'
import { useAuth } from '@/composables/useAuth'
import { swipeService } from '@/services/swipe.service'
import type { SwipeWithMovie } from '@/types'
import { computed, onMounted, ref } from 'vue'

const user = computed(() => {
  const authUser = useAuth().user
  return {
    id: authUser.value?.id ?? '',
    name: authUser.value?.name ?? '',
    email: authUser.value?.email ?? '',
    image: authUser.value?.image ?? null,
  }
})
const likedMovies = ref<SwipeWithMovie[]>([])
const dislikedMovies = ref<SwipeWithMovie[]>([])
const watchedMovies = ref<SwipeWithMovie[]>([])

onMounted(async () => {
  likedMovies.value = await swipeService.getSwipes('LIKE')
  dislikedMovies.value = await swipeService.getSwipes('DISLIKE')
  watchedMovies.value = await swipeService.getSwipes('WATCHED')
})
</script>

<template>
  <UserDetails v-if="user" :user="user" />
  <router-link to="/profile/movies?type=like">
    <SwipedMoviesCard label="Liked Movies" :movies="likedMovies.map((swipe) => swipe.movie)" />
  </router-link>
  <router-link to="/profile/movies?type=dislike">
    <SwipedMoviesCard
      label="Disliked Movies"
      :movies="dislikedMovies.map((swipe) => swipe.movie)"
    />
  </router-link>
  <router-link to="/profile/movies?type=watched">
    <SwipedMoviesCard label="Watched Movies" :movies="watchedMovies.map((swipe) => swipe.movie)" />
  </router-link>
</template>
