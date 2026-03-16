<script setup lang="ts">
import { friendshipService } from '@/services/friendship.service'
import type { PendingRequest, SentRequest } from '@/types'
import { onMounted, ref } from 'vue'

const currentTab = ref<'received' | 'sent'>('received')
const receivedRequests = ref<PendingRequest[]>([])
const sentRequests = ref<SentRequest[]>([])
const isLoadingReceived = ref(false)
const isLoadingSent = ref(false)

const handleResolved = (tab: 'received' | 'sent', requestId: string) => {
  if (tab === 'received') {
    receivedRequests.value = receivedRequests.value.filter((r) => r.id !== requestId)
    return
  }
  if (tab === 'sent') {
    sentRequests.value = sentRequests.value.filter((r) => r.id !== requestId)
    return
  }
}

onMounted(() => {
  isLoadingReceived.value = true
  friendshipService
    .getReceivedFriendRequests()
    .then((requests) => {
      receivedRequests.value = requests
    })
    .catch((error) => {
      console.error('Failed to fetch pending requests:', error)
    })
    .finally(() => {
      isLoadingReceived.value = false
    })

  isLoadingSent.value = true
  friendshipService
    .getSentFriendRequests()
    .then((requests) => {
      sentRequests.value = requests
    })
    .catch((error) => {
      console.error('Failed to fetch sent requests:', error)
    })
    .finally(() => {
      isLoadingSent.value = false
    })
})
</script>

<template>
  <ViewHeaderBar label="Friend Requests" :showBackButton="true" />
  <div>
    <!-- Tab Navigation -->
    <div class="flex">
      <TabToggle
        label="Received"
        :isActive="currentTab === 'received'"
        @click="currentTab = 'received'"
      />
      <TabToggle label="Sent" :isActive="currentTab === 'sent'" @click="currentTab = 'sent'" />
    </div>
    <!-- Received Requests Tab -->
    <div v-if="currentTab === 'received'">
      <div v-if="isLoadingReceived" class="h-full flex items-center justify-center mt-5">
        <van-loading type="spinner" size="24px" vertical>Loading...</van-loading>
      </div>
      <div v-else-if="receivedRequests.length === 0" class="text-center text-gray-500 mt-5">
        No pending friend requests
      </div>
      <FriendListItem
        v-else
        v-for="request in receivedRequests"
        :key="request.requester.id"
        :friend="request.requester"
      >
        <template #actions
          ><ReceivedFriendRequestActions
            :requestId="request.id"
            @resolved="(requestId: string) => handleResolved('received', requestId)" /></template
      ></FriendListItem>
    </div>
    <!-- Sent Requests Tab -->
    <div v-if="currentTab === 'sent'">
      <div v-if="isLoadingSent" class="h-full flex items-center justify-center mt-5">
        <van-loading type="spinner" size="24px" vertical>Loading...</van-loading>
      </div>
      <div v-else-if="sentRequests.length === 0" class="text-center text-gray-500 mt-5">
        No sent friend requests
      </div>
      <FriendListItem
        v-else
        v-for="request in sentRequests"
        :key="request.addressee.id"
        :friend="request.addressee"
      >
        <template #actions
          ><SentFriendRequestActions
            :requestId="request.id"
            @resolved="(requestId: string) => handleResolved('sent', requestId)"
        /></template>
      </FriendListItem>
    </div>
  </div>
</template>
