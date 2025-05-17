<template>
  <div class="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Auction</h1>
        <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
          @click="isCreateModalOpen = true">
          <Icon name="material-symbols:add" size="24" />
          Add Item
        </button>
      </div>

      <div v-if="loading" class="p-4 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
      </div>

      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>

      <div v-else-if="auctionItems.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
        No active items right now
      </div>

      <div v-else class="w-full overflow-x-auto p-0 m-0">
        <UTable ref="table" :data="auctionItems" :columns="columns"
          class="w-full divide-y divide-gray-200 dark:divide-gray-700" />
      </div>
    </div>

    <CreateAuctionModal v-if="isCreateModalOpen" @close="isCreateModalOpen = false" @created="handleItemAdded" />

    <BidModal v-if="selectedItem" :item="selectedItem" @close="selectedItem = null" @bid-placed="handleBidPlaced" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, resolveComponent } from 'vue'
import type { Database } from '~/supabase/database.types'
import type { TableColumn } from '@nuxt/ui'

useHead({
  script: [
    {
      src: 'https://questlog.gg/embed/tooltip.min.js',
      async: true
    }
  ]
})

type AuctionItem = Database['public']['Tables']['auction_items']['Row']
type AuctionItemUpdate = Database['public']['Tables']['auction_items']['Update']

const supabase = useSupabaseClient<Database>()
const auctionItems = ref<AuctionItem[]>([])
const isCreateModalOpen = ref(false)
const selectedItem = ref<AuctionItem | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const publicUserId = ref<string | null>(null)
const { getUserData } = useAuth()

const fetchAuctionItems = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('auction_items')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    auctionItems.value = data || []
  } catch (err) {
    console.error('Error fetching auction items:', err)
    error.value = 'Failed to load auction items'
  } finally {
    loading.value = false
  }
}

const openBidModal = (item: AuctionItem) => {
  selectedItem.value = item
}

const stopAuction = async (itemId: string) => {
  try {
    const update: AuctionItemUpdate = { is_active: false }
    const { error } = await supabase
      .from('auction_items')
      .update(update)
      .eq('id', itemId)

    if (error) throw error

    await fetchAuctionItems()
  } catch (err) {
    console.error('Error stopping auction:', err)
    error.value = 'Failed to stop auction'
  }
}

const handleItemAdded = () => {
  isCreateModalOpen.value = false
  fetchAuctionItems()
}

const handleBidPlaced = () => {
  selectedItem.value = null
  fetchAuctionItems()
}

const formatTimeLeft = (timeLeft: string) => {
  const now = new Date()
  const end = new Date(timeLeft)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const isTimeRunningLow = (timeLeft: string) => {
  const now = new Date()
  const end = new Date(timeLeft)
  const diff = end.getTime() - now.getTime()
  return diff < 1000 * 60 * 60 // Less than 1 hour
}

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<AuctionItem>[] = [{
  accessorKey: 'name',
  header: () => h('div', 'Name'),
  enableSorting: false,
  cell: ({ row }) => h('a', {
    href: row.original.questlog_url,
    target: '_blank',
    class: 'text-white hover:underline cursor-pointer'
  }, row.getValue('name'))
}, {
  accessorKey: 'lowest_bid',
  header: () => h('div', 'Lowest Bid'),
  enableSorting: false,
  cell: ({ row }) => h('div', `${row.getValue('lowest_bid')} DKP`)
}, {
  accessorKey: 'current_bid',
  header: () => h('div', 'Current Bid'),
  enableSorting: false,
  cell: ({ row }) => h('div', row.getValue('current_bid') ? `${row.getValue('current_bid')} DKP` : 'No bids')
}, {
  accessorKey: 'time_left',
  header: () => h('div', 'Time Left'),
  enableSorting: false,
  cell: ({ row }) => h('span', {
    class: isTimeRunningLow(row.getValue('time_left')) ? 'text-red-500' : ''
  }, formatTimeLeft(row.getValue('time_left')))
}, {
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    const item = row.original
    if (item.created_by === publicUserId.value) {
      // Show dropdown with both actions
      const items = [
        {
          label: 'Place Bid',
          onSelect: () => openBidModal(item)
        },
        {
          label: 'Stop Auction',
          onSelect: () => stopAuction(item.id)
        }
      ]
      return h('div', { class: 'text-right' }, h(UDropdownMenu, {
        items,
        'aria-label': 'Actions dropdown'
      }, () => h(UButton, {
        icon: 'i-lucide-ellipsis-vertical',
        color: 'neutral',
        variant: 'ghost',
        class: 'ml-auto',
        'aria-label': 'Actions dropdown'
      })))
    } else {
      // Show only Place Bid button
      return h(UButton, {
        color: 'primary',
        variant: 'solid',
        onClick: () => openBidModal(item)
      }, { default: () => 'Place Bid' })
    }
  }
}]

onMounted(async () => {
  const userData = await getUserData()
  publicUserId.value = userData?.id ?? null
  fetchAuctionItems()
})
</script>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

@media (max-width: 640px) {
  .overflow-x-auto {
    margin: 0 -1rem;
    padding: 0 1rem;
  }
}

:deep(.divide-y > :not([hidden]) ~ :not([hidden])) {
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: rgb(229 231 235);
}

.dark :deep(.divide-y > :not([hidden]) ~ :not([hidden])) {
  border-top-color: rgb(55 65 81);
}
</style>