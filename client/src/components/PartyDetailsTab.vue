<script setup lang="ts">
import { partiesService } from '@/services/parties.service'
import type { Movie, Party } from '@/types'
import { ref } from 'vue'

const props = defineProps<{
  party: Party
}>()

const matchingMovies = ref<Movie[]>([])
const currentIndex = ref(0)
const isPending = ref(false)

const handleFindMatchingMovies = () => {
  isPending.value = true
  partiesService
    .getMatchingMovies(props.party.id)
    .then((movies) => {
      matchingMovies.value = movies
    })
    .catch((error) => {
      console.error('Error fetching matching movies:', error)
    })
    .finally(() => {
      isPending.value = false
    })
}
</script>

<template>
  <div class="h-full flex flex-col">
    <PartyLeaveButton v-if="party" :party="party" />
    <div class="flex-1 min-h-0 p-4">
      <MovieCard :movie="matchingMovies[currentIndex]" />
    </div>
    <div class="shrink-0 p-4">
      <button
        class="h-10 w-full bg-transparent border border-blue-500 !text-blue-500 font-medium rounded hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
        @click="handleFindMatchingMovies"
        :disabled="isPending"
      >
        <van-loading v-if="isPending" type="spinner" size="24px" vertical>Loading...</van-loading>
        <span v-else>Find Matching Movies</span>
      </button>
    </div>
  </div>
</template>
