<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import type { FriendItem, UserStub } from '@/types'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const friends = ref<UserStub[]>([])
const isLoading = ref(false)
const router = useRouter()

const onSearchQuery = (query: string) => {
  router.push(`/friends/search?q=${query}`)
}

onMounted(() => {
  isLoading.value = true
  friendshipService
    .getFriends()
    .then((friendships) => {
      friends.value = friendships.map((friendship: FriendItem) => ({
        id: friendship.friend.id,
        name: friendship.friend.name,
        image: friendship.friend.image,
      }))
    })
    .catch((error) => {
      console.error('Failed to fetch friends:', error)
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <div>
    <ViewHeaderBar label="Friends" />
    <div class="p-4">
      <router-link to="/friends/requests">
        <button
          class="h-10 w-full bg-transparent border border-blue-500 !text-blue-500 font-medium rounded hover:bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer"
        >
          View Friend Requests
        </button>
      </router-link>
    </div>
    <SearchBar @searchQuery="onSearchQuery" />
    <div v-if="isLoading" class="h-full flex items-center justify-center mt-5">
      <van-loading type="spinner" size="24px" vertical>Loading...</van-loading>
    </div>
    <div v-else-if="friends.length === 0" class="text-center text-gray-500 mt-5">
      You have no friends yet
    </div>
    <div class="mt-4">
      <FriendListItem v-for="friend in friends" :key="friend.id" :friend="friend">
        <template #actions>
          <FriendActions
            :user="friend"
            @unfriended="(userId: string) => (friends = friends.filter((f) => f.id !== userId))"
          />
        </template>
      </FriendListItem>
    </div>
  </div>
</template>
