<script setup lang="ts">
import ViewHeaderBar from '@/components/ViewHeaderBar.vue'
import { partiesService } from '@/services/parties.service'
import type { Party } from '@/types'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const partyId = route.params.id as string

const party = ref<Party | null>(null)

const isLoading = ref(false)

const currentTab = ref<'details' | 'members'>('details')

onMounted(() => {
  // Fetch party details
  isLoading.value = true
  partiesService
    .getParty(partyId)
    .then((p) => {
      party.value = p
    })
    .catch((error) => {
      console.error('Error fetching party:', error)
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <div class="h-full flex flex-col">
    <ViewHeaderBar label="Party" :showBackButton="true" />
    <div class="shrink-0 flex">
      <TabToggle
        label="Details"
        :isActive="currentTab === 'details'"
        @click="currentTab = 'details'"
      />
      <TabToggle
        label="Members"
        :isActive="currentTab === 'members'"
        @click="currentTab = 'members'"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center mt-5">
      <van-loading type="spinner" size="24px" vertical>Loading...</van-loading>
    </div>

    <!-- Tabs -->
    <div class="flex-1 min-h-0">
      <PartyDetailsTab v-if="currentTab === 'details' && party" :party="party" />
      <PartyMembersTab v-if="currentTab === 'members' && party" :partyId="party.id" />
    </div>
  </div>
</template>
