<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import { ref } from 'vue'

const props = defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  sentFriendRequest: [userId: string]
}>()

const isPending = ref<boolean>(false)

const handleSendFriendRequest = () => {
  isPending.value = true
  friendshipService
    .sendFriendRequest(props.userId)
    .then(() => {
      emit('sentFriendRequest', props.userId)
    })
    .catch((error) => {
      console.error('Failed to send friend request:', error)
    })
    .finally(() => {
      isPending.value = false
    })
}
</script>

<template>
  <button
    class="bg-green-700 !text-white w-8 h-8 rounded-md"
    aria-label="Send friend request"
    @click="handleSendFriendRequest"
    :disabled="isPending"
  >
    <van-loading v-if="isPending" size="16px" />
    <van-icon v-else name="plus" />
  </button>
</template>
