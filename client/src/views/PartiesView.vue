<script setup lang="ts">
import CreateParty from '@/components/CreateParty.vue'
import { partiesService } from '@/services/parties.service'
import type { Party } from '@/types'
import { onMounted, ref } from 'vue'

const parties = ref<Party[]>([])
const isLoading = ref(false)

onMounted(() => {
  isLoading.value = true
  partiesService
    .getParties()
    .then((party) => {
      parties.value = party
    })
    .catch((err) => {
      console.error('Error fetching parties:', err)
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <ViewHeaderBar label="Parties" />
  <div class="p-4">
    <CreateParty />
  </div>

  <!-- Loading Spinner -->
  <div v-if="isLoading" class="flex justify-center items-center mt-5">
    <van-loading type="spinner" size="24px">Loading...</van-loading>
  </div>

  <!-- No Parties Message -->
  <div v-else-if="parties.length === 0" class="text-center text-gray-500 mt-5">No parties</div>

  <!-- Parties List -->
  <div v-else>
    <router-link
      v-for="party in parties"
      :key="party.id"
      :to="`/parties/${party.id}`"
      class="pointer"
    >
      <div class="shadow p-4">
        <h3>{{ party.name }}</h3>
      </div>
    </router-link>
  </div>
</template>
