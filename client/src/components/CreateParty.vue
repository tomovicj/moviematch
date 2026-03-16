<script setup lang="ts">
import { partiesService } from '@/services/parties.service'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isModalOpen = ref(false)
const partyName = ref('')
const errorMessage = ref('')

const openModal = () => {
  partyName.value = ''
  errorMessage.value = ''
  isModalOpen.value = true
}

const handleCreateParty = () => {
  const name = partyName.value.trim()
  if (!name) {
    errorMessage.value = 'Party name cannot be empty.'
    return
  }

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
          @input="errorMessage = ''"
          id="party-name"
          type="text"
          :class="[
            'border rounded py-2 px-4 w-full focus:outline-none focus:ring-2',
            errorMessage
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500',
          ]"
        />
        <p v-if="errorMessage" class="text-red-500 text-sm mt-1">{{ errorMessage }}</p>
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
