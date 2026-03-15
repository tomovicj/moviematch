<script setup lang="ts">
import type { UserStub } from '@/types'

defineProps<{
  friend: UserStub
}>()
</script>

<template>
  <div class="flex items-center justify-between shadow p-4">
    <div class="flex items-center gap-4">
      <img
        v-if="friend.image"
        :src="friend.image"
        :alt="friend.name + ' profile picture'"
        class="w-12 h-12 rounded-full"
      />
      <h3 class="text-lg font-medium">{{ friend.name }}</h3>
    </div>
    <slot name="actions" />
  </div>
</template>
