<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import type { UserStub } from '@/types'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const people = ref<UserStub[]>([])
const isLoading = ref(false)

const route = useRoute()
const router = useRouter()

watch(
  () => route.query.q,
  (q) => {
    const query = (q as string) || ''
    if (!query) {
      people.value = []
      return
    }
    isLoading.value = true
    friendshipService
      .searchUsersForFriendRequest(query)
      .then((users) => {
        people.value = users
      })
      .catch((err) => {
        console.error('Error searching users:', err)
      })
      .finally(() => {
        isLoading.value = false
      })
  },
  { immediate: true },
)

const onSearchQuery = (query: string) => {
  router.replace({ query: { q: query } })
}

const handleSentFriendRequest = (userId: string) => {
  people.value = people.value.filter((user) => user.id !== userId)
}
</script>

<template>
  <ViewHeaderBar :label="'Search'" :showBackButton="true" />
  <SearchBar
    class="py-4"
    :initialQuery="(route.query.q as string) || ''"
    @searchQuery="onSearchQuery"
  />
  <div v-if="isLoading" class="text-center mt-8">
    <van-loading size="24px">Loading...</van-loading>
  </div>
  <div v-else-if="people.length === 0" class="text-center text-gray-500 mt-8">
    <p>No users found.</p>
  </div>
  <div v-else>
    <FriendListItem v-for="person in people" :key="person.id" :friend="person">
      <template #actions>
        <AddFriendAction @sentFriendRequest="handleSentFriendRequest" />
      </template>
    </FriendListItem>
  </div>
</template>
