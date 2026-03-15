<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import { ref } from 'vue'

const props = defineProps<{
  requestId: string
}>()

const emit = defineEmits<{
  resolved: [requestId: string]
}>()

const isPending = ref<boolean>(false)

const handleAccept = () => {
  isPending.value = true
  friendshipService
    .acceptRequest(props.requestId)
    .then(() => {
      emit('resolved', props.requestId)
    })
    .catch((error) => {
      console.error('Failed to accept friend request:', error)
    })
    .finally(() => {
      isPending.value = false
    })
}

const handleDecline = () => {
  isPending.value = true
  friendshipService
    .rejectRequest(props.requestId)
    .then(() => {
      emit('resolved', props.requestId)
    })
    .catch((error) => {
      console.error('Failed to decline friend request:', error)
    })
    .finally(() => {
      isPending.value = false
    })
}
</script>

<template>
  <div class="flex gap-2">
    <button
      class="bg-green-700 !text-white w-8 h-8 rounded-md"
      @click="handleAccept"
      :disabled="isPending"
    >
      <van-icon name="success" />
    </button>
    <button
      class="bg-red-700 !text-white w-8 h-8 rounded-md"
      @click="handleDecline"
      :disabled="isPending"
    >
      <van-icon name="cross" />
    </button>
  </div>
</template>
