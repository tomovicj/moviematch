<script setup lang="ts">
import { partiesService } from '@/services/parties.service'
import type { Movie, Party } from '@/types'
import { ref } from 'vue'

const props = defineProps<{
  party: Party
}>()

const matchingMovies = ref<Movie[]>([])
const currentIndex = ref(0)
const loadedMovies = ref(false)
const isPending = ref(false)

const handleFindMatchingMovies = () => {
  isPending.value = true
  partiesService
    .getMatchingMovies(props.party.id)
    .then((movies) => {
      matchingMovies.value = movies
      loadedMovies.value = true
    })
    .catch((error) => {
      console.error('Error fetching matching movies:', error)
    })
    .finally(() => {
      isPending.value = false
    })
}

const goToPreviousMovie = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

const goToNextMovie = () => {
  if (currentIndex.value < matchingMovies.value.length - 1) {
    currentIndex.value += 1
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <PartyLeaveButton v-if="party" :party="party" />

    <!-- No Matching Movies -->
    <div v-if="loadedMovies && matchingMovies.length === 0" class="text-center text-gray-500 mt-5">
      No matching movies found
    </div>

    <div v-else class="flex flex-col flex-1">
      <!-- Movie Card -->
      <div class="flex-1 min-h-0 p-4">
        <MovieCard :movie="matchingMovies[currentIndex]" />
      </div>
      <div class="shrink-0 p-4">
        <!-- Find Matching Movies Button -->
        <button
          v-if="!loadedMovies"
          class="h-10 w-full bg-transparent border border-blue-500 !text-blue-500 font-medium rounded hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
          @click="handleFindMatchingMovies"
          :disabled="isPending"
        >
          <van-loading v-if="isPending" type="spinner" size="24px" vertical>Loading...</van-loading>
          <span v-else>Find Matching Movies</span>
        </button>

        <!-- Change Movie Buttons -->
        <div v-else class="flex gap-4">
          <button
            @click="goToPreviousMovie"
            :disabled="currentIndex === 0"
            aria-label="Previous movie"
            class="w-full h-10 w-full bg-transparent border border-blue-500 !text-blue-500 font-medium rounded hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
          >
            <van-icon name="arrow-left" />
          </button>
          <button
            @click="goToNextMovie"
            :disabled="currentIndex === matchingMovies.length - 1"
            aria-label="Next movie"
            class="w-full h-10 w-full bg-transparent border border-blue-500 !text-blue-500 font-medium rounded hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
          >
            <van-icon name="arrow" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
