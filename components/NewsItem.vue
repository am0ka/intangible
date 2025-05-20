<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden">
    <div class="flex">
      <div v-if="item.image" class="w-1/3 min-w-[200px]">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover">
      </div>
      <div class="p-4 flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <span class="px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
            {{ item.category }}
          </span>
          <span class="text-sm text-gray-400">
            {{ formatDate(item.pubDate) }}
          </span>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">
          <NuxtLink :href="item.link" target="_blank" rel="noopener noreferrer"
            class="hover:text-blue-400 transition-colors">
            {{ item.title }}
          </NuxtLink>
        </h2>
        <p class="text-gray-300">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsItem } from '~/types/news'

defineProps<{
  item: NewsItem
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}
</script>