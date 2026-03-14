<script setup lang="ts">
defineProps<{
  label: string
  showBackButton?: boolean
}>()
</script>

<template>
  <div class="flex gap-4 items-center py-4 px-2 shadow">
    <button @click="$router.back()" v-if="showBackButton">
      <van-icon name="arrow-left" size="24px" />
    </button>
    <h1 class="text-2xl font-bold capitalize pt-1">{{ label }}</h1>
  </div>
</template>
