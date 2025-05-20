<template>
  <div class="container mx-auto px-4 py-8 min-h-screen bg-gray-900">
    <div v-if="pending" class="text-center text-gray-300">
      Loading event...
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      Error loading event: {{ error }}
    </div>

    <div v-else-if="!event" class="text-center text-gray-300">
      Event not found
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <div v-if="event.image" class="mb-8">
        <img :src="event.image" :alt="event.title" class="w-full h-64 object-cover rounded-lg">
      </div>

      <div class="flex items-center gap-2 mb-4">
        <time :datetime="event.datetime" class="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
          {{ formatDateTime(event.datetime) }}
        </time>
        <span class="text-sm text-yellow-400 bg-gray-700/50 px-3 py-1 rounded-full">
          {{ event.dkp }} DKP
        </span>
      </div>
      <h1 class="text-4xl font-bold text-white mb-4">{{ event.title }}</h1>
      <div class="prose prose-invert max-w-none">
        <div class="text-gray-300">{{ event.description }}</div>
        <GroupAssignments :participants="participants" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event'
import { computed } from 'vue'

const route = useRoute()

definePageMeta({
  middleware: ['auth']
})

const { data: event, pending, error } = await useAsyncData<Event>(
  `event-${route.params.slug}`,
  () => $fetch(`/api/events/${route.params.slug}`)
)

const { data: participantsData } = await useAsyncData<Participant[]>(
  `event-participants-${event.value?.id}`,
  () => $fetch(`/api/events/${event.value?.id}/participants`, {
    params: {
      type: 'accept'
    }
  }),
  {
    watch: [() => event.value?.id]
  }
)

const participants = computed(() => participantsData.value || [])

interface Participant {
  id: string
  server_name: string
  role: 'tank' | 'heal' | 'dps'
  class: string
  attended: boolean | null
}

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style>
.prose {
  color: #d1d5dc;
}

.prose h2 {
  color: #fff;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  line-height: calc(2 / 1.5);
}

.prose ul {
  list-style-type: disc;
  list-style-position: inside;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>