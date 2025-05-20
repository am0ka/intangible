<template>
  <div class="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
      </div>

      <div class="p-4">
        <div class="space-y-6">
          <UCalendar v-model="modelValue" class="w-full">
            <template #day="{ day }">
              <UChip 
                :show="!!getColorByDate(day.toDate('UTC'))" 
                :color="getColorByDate(day.toDate('UTC'))" 
                size="2xs"
              >
                {{ day.day }}
              </UChip>
            </template>
          </UCalendar>

          <div v-if="selectedDateEvents.length > 0" class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Events on {{ formatDate(modelValue) }}
            </h2>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <EventCardMini v-for="event in selectedDateEvents" :key="event.id" :event="event" />
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            No events scheduled for this date
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CalendarDate } from '@internationalized/date'
import type { Event } from '~/types/event'

definePageMeta({
  middleware: ['auth']
})

const { data: events } = await useAsyncData<Event[]>('events', () =>
  $fetch('/api/events')
)

// Get the latest event date
const latestEventDate = computed(() => {
  if (!events.value?.length) return new CalendarDate(2024, 5, 20) // Default date if no events

  const latestEvent = events.value.reduce((latest, current) => {
    const latestDate = new Date(latest.datetime)
    const currentDate = new Date(current.datetime)
    return currentDate > latestDate ? current : latest
  })

  const date = new Date(latestEvent.datetime)
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
})

const modelValue = shallowRef(latestEventDate.value)

const selectedDateEvents = computed(() => {
  if (!events.value) return []
  const selectedDate = modelValue.value.toDate('UTC')
  return events.value.filter(event => {
    const eventDate = new Date(event.datetime)
    return isSameDay(eventDate, selectedDate)
  })
})

function getColorByDate(date: Date) {
  if (!events.value) return undefined
  const hasEvent = events.value.some(event => {
    const eventDate = new Date(event.datetime)
    return isSameDay(eventDate, date)
  })

  if (hasEvent) {
    return 'primary'
  }

  return undefined
}

function isSameDay(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
}

function formatDate(date: CalendarDate) {
  return new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
:deep(.u-calendar) {
  background-color: white;
}

.dark :deep(.u-calendar) {
  background-color: #1f2937; /* dark:bg-gray-800 */
}

:deep(.u-calendar-header) {
  color: #111827; /* text-gray-900 */
}

.dark :deep(.u-calendar-header) {
  color: white;
}

:deep(.u-calendar-cell) {
  color: #374151; /* text-gray-700 */
}

.dark :deep(.u-calendar-cell) {
  color: #d1d5db; /* text-gray-300 */
}

:deep(.u-calendar-cell[aria-selected="true"]) {
  background-color: #3b82f6; /* bg-primary-500 */
  color: white;
}

:deep(.u-calendar-cell[aria-disabled="true"]) {
  color: #9ca3af; /* text-gray-400 */
}

.dark :deep(.u-calendar-cell[aria-disabled="true"]) {
  color: #4b5563; /* text-gray-600 */
}
</style>