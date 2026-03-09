<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="home-page">
    <div class="home-card">
      <van-image v-if="user?.image" :src="user.image" round width="72" height="72" class="avatar" />
      <van-icon v-else name="contact" size="72" color="#ccc" />

      <h2 class="user-name">{{ user?.name ?? 'Welcome' }}</h2>
      <p class="user-email">{{ user?.email }}</p>

      <van-button type="danger" size="normal" plain @click="handleLogout"> Sign out </van-button>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;
  padding: 24px;
}

.home-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 32px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar {
  margin-bottom: 8px;
}

.user-name {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #1a1a2e;
}

.user-email {
  font-size: 14px;
  color: #888;
  margin: 0 0 16px;
}
</style>
