<script setup lang="ts">
import { partiesService } from '@/services/parties.service'
import type { PartyInvitation } from '@/types'
import { onMounted, ref } from 'vue'

const invitations = ref<PartyInvitation[]>([])
const isLoading = ref(false)
const pendingInvitations = ref<Record<string, boolean>>({})

onMounted(() => {
  isLoading.value = true
  partiesService
    .getInvitations()
    .then((inv) => {
      invitations.value = inv
    })
    .catch((err) => {
      console.error('Failed to fetch party invitations', err)
    })
    .finally(() => {
      isLoading.value = false
    })
})

const handleAcceptInvitation = (invitationId: string) => {
  pendingInvitations.value[invitationId] = true
  partiesService
    .acceptInvitation(invitationId)
    .then(() => {
      invitations.value = invitations.value.filter((inv) => inv.id !== invitationId)
    })
    .catch((err) => {
      console.error('Failed to accept invitation', err)
    })
    .finally(() => {
      pendingInvitations.value[invitationId] = false
    })
}

const handleDeclineInvitation = (invitationId: string) => {
  pendingInvitations.value[invitationId] = true
  partiesService
    .declineInvitation(invitationId)
    .then(() => {
      invitations.value = invitations.value.filter((inv) => inv.id !== invitationId)
    })
    .catch((err) => {
      console.error('Failed to decline invitation', err)
    })
    .finally(() => {
      pendingInvitations.value[invitationId] = false
    })
}
</script>

<template>
  <ViewHeaderBar label="Party Invites" :showBackButton="true" />

  <!-- Loading -->
  <div v-if="isLoading" class="flex items-center justify-center mt-5">
    <van-loading type="spinner" size="24px" vertical>Loading...</van-loading>
  </div>

  <!-- No invites -->
  <div v-else-if="invitations.length === 0" class="text-center text-gray-500 mt-5">
    No pending party invitations
  </div>

  <!-- Invites List -->
  <div v-else>
    <div
      v-for="invitation in invitations"
      :key="invitation.id"
      class="p-4 shadow flex items-center justify-between"
    >
      <div>
        <h3 class="font-semibold">{{ invitation.party.name }}</h3>
        <p class="text-sm text-gray-500">
          Invited by: <span class="font-semibold">{{ invitation.invitee.name }}</span>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <!-- Decline Button -->
        <button
          class="bg-red-700 !text-white w-8 h-8 rounded-md"
          aria-label="Decline invitation"
          @click="handleDeclineInvitation(invitation.id)"
          :disabled="pendingInvitations[invitation.id]"
        >
          <van-loading v-if="pendingInvitations[invitation.id]" size="16px" />
          <van-icon v-else name="cross" />
        </button>

        <!-- Accept Button -->
        <button
          class="bg-green-700 !text-white w-8 h-8 rounded-md"
          aria-label="Accept invitation"
          @click="handleAcceptInvitation(invitation.id)"
          :disabled="pendingInvitations[invitation.id]"
        >
          <van-loading v-if="pendingInvitations[invitation.id]" size="16px" />
          <van-icon v-else name="success" />
        </button>
      </div>
    </div>
  </div>
</template>
