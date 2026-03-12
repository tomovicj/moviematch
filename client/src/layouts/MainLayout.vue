<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const active = computed({
  get: () => (route.name as string) || '',
  set: (val: string) => {
    router.push({ name: val })
  },
})
</script>

<template>
  <!-- navbar is 50px -->
  <main class="h-[calc(100vh-50px)]">
    <RouterView />
  </main>
  <van-tabbar v-model="active">
    <van-tabbar-item name="profile" icon="contact-o">Profile</van-tabbar-item>
    <van-tabbar-item name="friends" icon="friends-o">Friends</van-tabbar-item>
    <van-tabbar-item name="feed" icon="like-o">Feed</van-tabbar-item>
    <van-tabbar-item name="parties" icon="link-o">Parties</van-tabbar-item>
    <van-tabbar-item name="setting" icon="setting-o">Settings</van-tabbar-item>
  </van-tabbar>
</template>
