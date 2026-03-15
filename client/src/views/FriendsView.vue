<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import type { FriendItem, UserStub } from '@/types'
import { onMounted, ref } from 'vue'

const friends = ref<UserStub[]>([])

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
    <router-link to="/friends/requests" class="text-blue-500 hover:underline mb-4 inline-block">
      View Friend Requests
    </router-link>
    <div v-if="friends.length === 0" class="p-4 text-center text-gray-500">
      You have no friends yet.
    </div>
    <div>
      <FriendListItem v-for="friend in friends" :key="friend.id" :friend="friend" />
    </div>
  </div>
</template>
