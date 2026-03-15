<script setup lang="ts">
defineProps<{
  label: string
  isActive?: boolean
}>()
</script>

<template>
  <button
    :class="[
      'w-full',
      'h-10',
      'border',
      'border-gray-500',
      { 'bg-blue-500 !text-white': isActive },
    ]"
  >
    {{ label }}
  </button>
</template>
