<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import type { UserStub } from '@/types'
import { showConfirmDialog } from 'vant'
import { ref } from 'vue'

const props = defineProps<{
  user: UserStub
}>()

const emit = defineEmits<{
  unfriended: [userId: string]
}>()

const isPending = ref<boolean>(false)

const unfriendUser = () => {
  isPending.value = true
  friendshipService
    .unfriendUser(props.user.id)
    .then(() => {
      emit('unfriended', props.user.id)
    })
    .catch((error) => {
      console.error('Failed to unfriend user:', error)
    })
    .finally(() => {
      isPending.value = false
    })
}

const handleUnfriend = () => {
  showConfirmDialog({
    title: 'Confirm Unfriend',
    message: `Are you sure you want to unfriend ${props.user.name}?`,
    confirmButtonText: 'Yes, Unfriend',
    cancelButtonText: 'Cancel',
  }).then(() => {
    unfriendUser()
  })
}
</script>

<template>
  <button
    class="bg-red-700 !text-white w-8 h-8 rounded-md"
    aria-label="Unfriend user"
    @click="handleUnfriend"
    :disabled="isPending"
  >
    <van-loading v-if="isPending" size="16px" />
    <van-icon v-else name="cross" />
  </button>
</template>
