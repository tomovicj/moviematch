<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { partiesService } from '@/services/parties.service'
import type { Party } from '@/types'
import { showConfirmDialog } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  party: Party
}>()

const router = useRouter()
const auth = useAuth()

const userId = auth.user.value?.id
const isHost = props.party.hostId === userId

const isPending = ref(false)

const handleLeaveOrDelete = () => {
  isPending.value = true
  if (isHost) {
    partiesService
      .deleteParty(props.party.id)
      .then(() => {
        router.replace('/parties')
      })
      .catch((error) => {
        console.error('Error deleting party:', error)
      })
      .finally(() => {
        isPending.value = false
      })
  } else {
    partiesService
      .leaveParty(props.party.id)
      .then(() => {
        router.replace('/parties')
      })
      .catch((error) => {
        console.error('Error leaving party:', error)
      })
      .finally(() => {
        isPending.value = false
      })
  }
}

const confirmLeaveOrDelete = () => {
  showConfirmDialog({
    title: `Confirm ${isHost ? 'Delete' : 'Leave'} Party`,
    message: `Are you sure you want to ${isHost ? 'delete' : 'leave'} ${props.party.name} party?`,
    confirmButtonText: `Yes, ${isHost ? 'Delete' : 'Leave'}`,
    confirmButtonColor: 'red',
    cancelButtonText: 'Cancel',
  }).then(() => {
    handleLeaveOrDelete()
  })
}
</script>

<template>
  <div class="p-4">
    <button
      class="h-10 w-full bg-transparent border border-red-500 !text-red-500 font-medium rounded hover:bg-red-50 active:bg-red-100 transition-colors cursor-pointer"
      @click="confirmLeaveOrDelete"
      :disabled="isPending"
    >
      <van-loading v-if="isPending" type="spinner" size="24px" vertical>Loading...</van-loading>
      <span v-else>{{ isHost ? 'Delete Party' : 'Leave Party' }}</span>
    </button>
  </div>
</template>
