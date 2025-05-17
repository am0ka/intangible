<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Place Bid</h2>
        <button class="close-btn" @click="$emit('close')">
          <Icon name="material-symbols:close-rounded" size="24" />
        </button>
      </div>

      <NuxtLink :to="item.questlog_url" target="_blank" class="item-preview">
        <img :src="item.image_url || ''" :alt="item.name" class="item-image" />
        <div class="item-details">
          <h3>{{ item.name }}</h3>
        </div>
      </NuxtLink>

      <div class="bid-info">
        <div class="info-row">
          <span>Minimum Bid:</span>
          <span>{{ item.lowest_bid }} DKP</span>
        </div>
        <div class="info-row">
          <span>Current Bid:</span>
          <span>{{ item.current_bid || 'No bids' }} DKP</span>
        </div>
        <div class="info-row">
          <span>Your DKP:</span>
          <span>{{ userDkp }} DKP</span>
        </div>
      </div>

      <form class="bid-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="bid-amount">Your Bid (DKP)</label>
          <input id="bid-amount" v-model.number="bidAmount" type="number" required :min="minBid"
            placeholder="Enter your bid amount" />
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting || !isValidBid">
            {{ isSubmitting ? 'Placing Bid...' : 'Place Bid' }}
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

type AuctionItem = Database['public']['Tables']['auction_items']['Row']

const props = defineProps<{
  item: AuctionItem
}>()

const emit = defineEmits<{
  (e: 'close' | 'bid-placed'): void
}>()

const supabase = useSupabaseClient<Database>()
const isSubmitting = ref(false)
const bidAmount = ref<number>(props.item.current_bid ? props.item.current_bid + 1 : props.item.lowest_bid)
const userDkp = ref(1000) // TODO: Fetch actual user DKP

const minBid = computed(() => {
  if (!props.item.current_bid) return props.item.lowest_bid
  return props.item.current_bid + 1
})

const isValidBid = computed(() => {
  if (!bidAmount.value) return false
  return bidAmount.value >= minBid.value && bidAmount.value <= userDkp.value
})

const handleSubmit = async () => {
  if (!isValidBid.value) return

  try {
    isSubmitting.value = true

    // Start a transaction
    const { error: bidError } = await supabase
      .from('auction_bids')
      .insert([{
        auction_item_id: props.item.id,
        bid_amount: bidAmount.value,
        is_winning: true
      }])

    if (bidError) throw bidError

    // Update the auction item with the new current bid
    const { error: updateError } = await supabase
      .from('auction_items')
      .update({ current_bid: bidAmount.value })
      .eq('id', props.item.id)

    if (updateError) throw updateError

    emit('bid-placed')
  } catch (error) {
    console.error('Error placing bid:', error)
    // You might want to show an error message to the user here
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

.item-preview {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}

.item-preview:hover {
  background-color: #333;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bid-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
}

.info-row:last-child {
  border-bottom: none;
}

.bid-form {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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