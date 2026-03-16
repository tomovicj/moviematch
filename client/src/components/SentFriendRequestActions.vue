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

const handleCancel = () => {
  isPending.value = true
  friendshipService
    .cancelRequest(props.requestId)
    .then(() => {
      emit('resolved', props.requestId)
    })
    .catch((error) => {
      console.error('Failed to cancel friend request:', error)
    })
    .finally(() => {
      isPending.value = false
    })
}
</script>

<template>
  <button
    class="bg-red-700 !text-white w-8 h-8 rounded-md"
    @click="handleCancel"
    :disabled="isPending"
  >
    <van-loading v-if="isPending" size="16px" />
    <van-icon v-else name="cross" />
  </button>
</template>
