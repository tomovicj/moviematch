<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { partiesService } from '@/services/parties.service'
import type { PartyMember } from '@/types'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  partyId: string
}>()

const auth = useAuth()
const currentUserId = auth.user.value?.id

const members = ref<PartyMember[]>([])
const isHost = ref(false)
const isLoading = ref(false)
const kickInProgress = ref<Record<string, boolean>>({})

onMounted(() => {
  isLoading.value = true
  partiesService
    .getPartyMembers(props.partyId)
    .then((m) => {
      members.value = m
      const host = m.find((member) => member.isHost)
      isHost.value = host?.id === currentUserId
    })
    .catch((error) => {
      console.error('Error fetching party members:', error)
    })
    .finally(() => {
      isLoading.value = false
    })
})

const handleKickMember = (memberId: string) => {
  kickInProgress.value[memberId] = true
  partiesService
    .kickMember(props.partyId, memberId)
    .then(() => {
      members.value = members.value.filter((m) => m.id !== memberId)
    })
    .catch((error) => {
      console.error('Error kicking member:', error)
    })
    .finally(() => {
      kickInProgress.value[memberId] = false
    })
}
</script>

<template>
  <div class="p-4">
    <router-link :to="`/parties/${props.partyId}/invite`">
      <button
        class="h-10 w-full bg-transparent border border-blue-500 !text-blue-500 font-medium rounded hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
      >
        Invite a Friend
      </button>
    </router-link>
  </div>

  <!-- Loading -->
  <div v-if="isLoading" class="flex items-center justify-center mt-5">
    <van-loading type="spinner" size="24px" vertical>Loading...</van-loading>
  </div>

  <!-- Members List -->
  <div v-else>
    <div
      v-for="member in members"
      :key="member.id"
      class="p-4 shadow flex items-center justify-between"
    >
      <h3 class="font-semibold">{{ member.name }}</h3>
      <van-icon
        name="medal-o"
        v-if="member.isHost"
        class="text-yellow-600"
        size="20"
        aria-label="Host"
      />
      <!-- Kick Button (Host only) -->
      <button
        v-if="isHost && !member.isHost"
        class="bg-red-700 !text-white w-8 h-8 rounded-md"
        @click="() => handleKickMember(member.id)"
        :disabled="kickInProgress[member.id]"
      >
        <van-loading v-if="kickInProgress[member.id]" size="16px" />
        <van-icon v-else name="cross" />
      </button>
    </div>
  </div>
</template>
