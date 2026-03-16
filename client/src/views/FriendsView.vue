<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import type { FriendItem, UserStub } from '@/types'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const friends = ref<UserStub[]>([])
const router = useRouter()

const onSearchQuery = (query: string) => {
  router.push(`/friends/search?q=${query}`)
}

onMounted(async () => {
  try {
    const friendships = await friendshipService.getFriends()
    const friendStubs: UserStub[] = friendships.map((friendship: FriendItem) => ({
      id: friendship.friend.id,
      name: friendship.friend.name,
      image: friendship.friend.image,
    }))
    friends.value = friendStubs
  } catch (error) {
    console.error('Failed to fetch friends:', error)
  }
})
</script>

<template>
  <div>
    <ViewHeaderBar label="Friends" />
    <div class="p-4">
      <router-link to="/friends/requests">
        <button class="h-10 w-full bg-blue-500 !text-white rounded hover:bg-blue-600">
          View Friend Requests
        </button>
      </router-link>
    </div>
    <SearchBar @searchQuery="onSearchQuery" />
    <div v-if="friends.length === 0" class="text-center text-gray-500 mt-5">
      You have no friends yet.
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
