<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  searchQuery: [query: string]
}>()

const searchQuery = ref<string>('')

const handleSubmit = () => {
  emit('searchQuery', searchQuery.value)
}
</script>

<template>
  <div class="w-full px-2">
    <form class="flex items-center border gap-2 rounded-full" @submit.prevent="handleSubmit">
      <input
        type="text"
        placeholder="Search for people to add"
        class="w-full h-10 px-3 rounded-full focus:outline-none"
        v-model="searchQuery"
      />
      <button
        type="submit"
        class="bg-blue-500 !text-white h-10 w-12 flex items-center justify-center rounded-full"
      >
        <van-icon name="search" size="20" />
      </button>
    </form>
  </div>
</template>
