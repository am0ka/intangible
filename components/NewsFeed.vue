<template>
  <div class="news-feed">
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
    <div v-else-if="error" class="text-red-500 text-center py-4">
      {{ error }}
    </div>
    <div v-else class="space-y-6">
      <NewsItem v-for="item in news" :key="item.link" :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsItem } from '~/types/news'

const loading = ref(true)
const error = ref<string | null>(null)
const news = ref<NewsItem[]>([])

const fetchNews = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await $fetch<{ items: NewsItem[] }>('/api/news/feed')
    news.value = response.items
  } catch (err) {
    error.value = 'Failed to load news. Please try again later.'
    console.error('Error fetching news:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.news-feed {
  max-width: 800px;
  margin: 0 auto;
}
</style> 