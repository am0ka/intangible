<template>
  <NuxtLink :to="`/events/${event.id}`" class="block">
    <div class="event-card">
      <div class="event-header">
        <time :datetime="event.datetime" class="event-time">
          {{ formatTime(event.datetime) }}
        </time>
        <span class="event-dkp">
          {{ event.dkp }} DKP
        </span>
      </div>
      <h3 class="event-title">{{ event.title }}</h3>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event'

defineProps<{
  event: Event
}>()

const formatTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.event-card {
  background-color: #1f2937;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.event-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.event-time,
.event-dkp {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
}

.event-time {
  color: #9ca3af;
  background-color: rgba(55, 65, 81, 0.5);
}

.event-dkp {
  color: #fbbf24;
  background-color: rgba(55, 65, 81, 0.5);
}

.event-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.dark .event-card {
  border-color: #374151;
}
</style>