<script setup lang="ts">
import { partiesService } from '@/services/parties.service'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isModalOpen = ref(false)
const partyName = ref('')

const openModal = () => {
  partyName.value = ''
  isModalOpen.value = true
}

const handleCreateParty = () => {
  const name = partyName.value.trim()
  if (!name) return // TODO: Show error message

  partiesService
    .createParty(name)
    .then((party) => {
      router.push(`/parties/${party.id}`)
    })
    .catch((err) => {
      console.error('Error creating party:', err)
    })
}
</script>

<template>
  <button
    @click="openModal"
    class="h-10 w-full bg-transparent border border-blue-500 !text-blue-500 font-medium rounded hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
  >
    Create a Party
  </button>

  <!-- Create Party Modal -->
  <van-popup v-model:show="isModalOpen" closeable close-icon="close" round>
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Create a Party</h2>
      <form @submit.prevent="handleCreateParty">
        <label for="party-name">Party Name</label>
        <input
          v-model="partyName"
          id="party-name"
          type="text"
          class="border border-gray-300 rounded py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full bg-blue-500 !text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
        >
          Create
        </button>
      </form>
    </div>
  </van-popup>
</template>
