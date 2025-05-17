<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Create New Auction</h2>
        <button class="close-btn" @click="$emit('close')">
          <Icon name="material-symbols:close-rounded" size="24" />
        </button>
      </div>

      <form class="modal-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Item Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter item name"
          />
        </div>

        <div class="form-group">
          <label for="questlog">QuestLog URL</label>
          <input
            id="questlog"
            v-model="form.questlog_url"
            type="url"
            required
            placeholder="https://questlog.gg/..."
            :class="{ 'border-red-500': !isValidQuestLogUrl && form.questlog_url }"
          />
          <span v-if="!isValidQuestLogUrl && form.questlog_url" class="text-red-500 text-sm">
            URL must be from questlog.gg
          </span>
        </div>

        <div class="form-group">
          <label for="lowest-bid">Lowest Bid (DKP)</label>
          <input
            id="lowest-bid"
            v-model.number="form.lowest_bid"
            type="number"
            required
            min="0"
            placeholder="Enter minimum bid amount"
          />
        </div>

        <div class="form-group">
          <label>Time Left</label>
          <div class="time-selection">
            <div class="time-inputs">
              <div class="time-input-group">
                <input
                  v-model.number="timeInputs.days"
                  type="number"
                  min="0"
                  placeholder="Days"
                  class="time-input"
                  @input="updateDateTimeFromInputs"
                />
                <span class="time-label">Days</span>
              </div>
              <div class="time-input-group">
                <input
                  v-model.number="timeInputs.hours"
                  type="number"
                  min="0"
                  max="23"
                  placeholder="Hours"
                  class="time-input"
                  @input="updateDateTimeFromInputs"
                />
                <span class="time-label">Hours</span>
              </div>
              <div class="time-input-group">
                <input
                  v-model.number="timeInputs.minutes"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Minutes"
                  class="time-input"
                  @input="updateDateTimeFromInputs"
                />
                <span class="time-label">Minutes</span>
              </div>
              <div class="time-input-group">
                <input
                  v-model.number="timeInputs.seconds"
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Seconds"
                  class="time-input"
                  @input="updateDateTimeFromInputs"
                />
                <span class="time-label">Seconds</span>
              </div>
            </div>
            <div class="datetime-picker">
              <input
                v-model="form.time_left"
                type="datetime-local"
                :min="minDateTime"
                class="datetime-input"
                @input="updateInputsFromDateTime"
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting || !isValidQuestLogUrl">
            {{ isSubmitting ? 'Creating...' : 'Create Auction' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/supabase/database.types'

const emit = defineEmits<{
  (e: 'close' | 'created'): void
}>()

const supabase = useSupabaseClient<Database>()
const isSubmitting = ref(false)

const timeInputs = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const form = ref({
  name: '',
  questlog_url: '',
  lowest_bid: 0,
  time_left: ''
})

const isValidQuestLogUrl = computed(() => {
  try {
    const url = new URL(form.value.questlog_url)
    return url.hostname === 'questlog.gg'
  } catch {
    return false
  }
})

const minDateTime = computed(() => {
  const now = new Date()
  return now.toISOString().slice(0, 16)
})

const updateDateTimeFromInputs = () => {
  const now = new Date()
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + timeInputs.value.days)
  endDate.setHours(endDate.getHours() + timeInputs.value.hours)
  endDate.setMinutes(endDate.getMinutes() + timeInputs.value.minutes)
  endDate.setSeconds(endDate.getSeconds() + timeInputs.value.seconds)
  form.value.time_left = endDate.toISOString().slice(0, 16)
}

const updateInputsFromDateTime = () => {
  if (!form.value.time_left) return
  
  const now = new Date()
  const endDate = new Date(form.value.time_left)
  const diff = endDate.getTime() - now.getTime()
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  timeInputs.value = { days, hours, minutes, seconds }
}

const handleSubmit = async () => {
  if (!isValidQuestLogUrl.value) return

  try {
    isSubmitting.value = true

    const { error } = await supabase
      .from('auction_items')
      .insert([{
        ...form.value,
        time_left: form.value.time_left || (() => {
          updateDateTimeFromInputs()
          return form.value.time_left
        })()
      }])

    if (error) throw error

    emit('created')
  } catch (error) {
    console.error('Error creating auction:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.close-btn {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 0.5rem;
}

.close-btn:hover {
  color: white;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #a0a0a0;
}

input {
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: white;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

.time-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.time-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-input {
  width: 100%;
  text-align: center;
}

.time-label {
  font-size: 0.75rem;
  color: #a0a0a0;
  text-align: center;
}

.datetime-picker {
  width: 100%;
}

.datetime-input {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: 1px solid #666;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
}

.submit-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background-color: #45a049;
}
</style> 