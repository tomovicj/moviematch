<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import type { UserProfile } from '@/types'
import { useRouter } from 'vue-router'

defineProps<{
  user: UserProfile
}>()

const auth = useAuth()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="flex items-center gap-5 p-4 shadow">
    <img v-if="user.image" :src="user.image" alt="User Avatar" class="rounded-full w-24 h-24" />
    <div>
      <h3 class="text-lg font-bold">{{ user.name }}</h3>
      <p class="text-gray-400">{{ user.email }}</p>
      <button
        class="bg-red-500 !text-white mt-3 px-2 py-1 rounded hover:bg-red-600"
        @click="handleLogout"
      >
        Log Out
      </button>
    </div>
  </div>
</template>
