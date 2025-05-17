<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden">
    <div class="block cursor-pointer" @click="navigateToEvent">
      <div v-if="event.image" class="p-2 sm:p-3">
        <img :src="event.image" :alt="event.title" class="w-full h-48 object-cover rounded-lg" />
      </div>
      <div class="p-4 sm:p-6">
        <div class="flex items-center justify-between gap-2 mb-2">
          <h3 class="text-xl font-semibold text-white">{{ event.title }}</h3>
          <div class="flex items-center gap-2">
            <span class="text-xs text-yellow-400 bg-gray-700/50 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {{ event.dkp }} DKP
            </span>
            <time :datetime="event.datetime"
              class="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {{ formatDateTime(event.datetime) }}
            </time>
          </div>
        </div>
      </div>
    </div>
    <div class="px-4 sm:px-6 pb-4 sm:pb-6">
      <div class="flex justify-end">
        <EventCheckIn :event="event" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{
  event: Event
}>()

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const navigateToEvent = () => {
  router.push(`/events/${props.event.id}`)
}
</script>