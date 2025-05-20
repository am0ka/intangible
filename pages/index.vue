<template>
  <div class="container mx-auto px-2 sm:px-4 py-8 min-h-screen bg-gray-900">
    <h1 class="text-4xl font-bold text-white text-center mb-8">Game News</h1>
    <NewsFeed />
  </div>
</template>

<script setup lang="ts">
import NewsFeed from '~/components/NewsFeed.vue'
</script>