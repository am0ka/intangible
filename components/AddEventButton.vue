<template>
  <div>
    <button class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-4"
      @click="isModalOpen = true">
      Add
    </button>

    <!-- Add Event Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-white">Add New Event</h3>
          <button class="text-gray-400 hover:text-white" @click="isModalOpen = false">
            <span class="sr-only">Close</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input v-model="form.title" type="text" required
              class="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea v-model="form.description" rows="3"
              class="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Date and Time</label>
            <input v-model="form.datetime" type="datetime-local" required
              class="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
            <input v-model="form.image" type="url"
              class="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Event Type</label>
            <select v-model="form.event_type_id" required
              class="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select an event type</option>
              <option v-for="type in eventTypes" :key="type.id" :value="type.id">
                {{ type.name }} ({{ type.dkp }} DKP)
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              @click="isModalOpen = false">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isModalOpen = ref(false)
const form = ref({
  title: '',
  description: '',
  datetime: '',
  image: '',
  event_type_id: ''
})

const { data: eventTypes } = await useAsyncData('event-types', () =>
  $fetch('/api/event-types')
)

const handleSubmit = async () => {
  try {
    // Send the request to create the event
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: form.value.title,
        description: form.value.description,
        datetime: form.value.datetime,
        image: form.value.image,
        event_type_id: form.value.event_type_id
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create event')
    }

    // Close modal and reset form
    isModalOpen.value = false
    form.value = {
      title: '',
      description: '',
      datetime: '',
      image: '',
      event_type_id: ''
    }

    // Refresh the events data
    await refreshNuxtData('events')
  } catch (error) {
    console.error('Error creating event:', error)
    // TODO: Add proper error handling/notification
  }
}
</script>