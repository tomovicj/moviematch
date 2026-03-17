<script setup lang="ts">
import { partiesService } from '@/services/parties.service'
import type { FriendItem } from '@/types'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const partyId = route.params.id as string

const availableFriends = ref<FriendItem[]>([])
const isLoading = ref(false)
const isInviting = ref<Record<string, boolean>>({})

onMounted(() => {
  isLoading.value = true
  partiesService
    .getAvailableFriends(partyId)
    .then((friends) => {
      availableFriends.value = friends
    })
    .catch((error) => {
      console.error('Failed to load available friends:', error)
    })
    .finally(() => {
      isLoading.value = false
    })
})

const handleInvite = (friendId: string) => {
  isInviting.value[friendId] = true
  partiesService
    .inviteFriend(partyId, friendId)
    .then(() => {
      availableFriends.value = availableFriends.value.filter(
        (friendship) => friendship.friend.id !== friendId,
      )
    })
    .catch((error) => {
      console.error('Failed to invite friend:', error)
    })
    .finally(() => {
      isInviting.value[friendId] = false
    })
}
</script>

<template>
  <ViewHeaderBar label="Party Invite" :showBackButton="true" />

  <!-- Loading -->
  <div v-if="isLoading" class="flex items-center justify-center mt-5">
    <van-loading type="spinner" size="24px" vertical>Loading...</van-loading>
  </div>

  <!-- No Available Friends -->
  <div v-else-if="availableFriends.length === 0" class="text-center text-gray-500 mt-5">
    No available friends to invite
  </div>

  <!-- Available Friend List -->
  <div v-else>
    <FriendListItem
      v-for="friendship in availableFriends"
      :key="friendship.friend.id"
      :friend="friendship.friend"
    >
      <!-- Invite Button -->
      <template #actions>
        <button
          class="bg-green-700 !text-white w-8 h-8 rounded-md"
          aria-label="Invite friend"
          @click="handleInvite(friendship.friend.id)"
          :disabled="isInviting[friendship.friend.id]"
        >
          <van-loading v-if="isInviting[friendship.friend.id]" size="16px" />
          <van-icon v-else name="plus" />
        </button>
      </template>
    </FriendListItem>
  </div>
</template>
