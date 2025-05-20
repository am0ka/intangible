<template>
  <div class="container mx-auto px-2 sm:px-4 py-8 min-h-screen bg-gray-900">
    <h1 class="text-4xl font-bold text-center text-white">Upcoming Events</h1>

    <div class="mt-4 b-2">
      <AddEventButton />
    </div>

    <div v-if="pending" class="text-center text-gray-300">
      Loading events...
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      Error loading events: {{ error }}
    </div>

    <div v-else-if="!events?.length" class="text-center text-gray-300">
      No events found
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { data: events, pending, error } = await useAsyncData('events', () =>
  $fetch('/api/events')
)
</script> 