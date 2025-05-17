<script setup lang="ts">
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'

type Member = {
  id: string
  server_name: string
  global_name: string
  last_used_role: 'tank' | 'dps' | 'heal'
  last_used_class: string | null
}

type Participation = {
  id: string
  type: 'accept' | 'maybe' | 'refuse'
  attended: boolean | null
  role: string | null
  class: string | null
  created_at: string
  event: {
    id: string
    title: string
    datetime: string
    event_type: {
      dkp: number
    } | null
  } | null
}

const route = useRoute()
const supabase = useSupabaseClient()
const member = ref<Member | null>(null)
const participations = ref<Participation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch member details and their participations
const fetchMemberDetails = async () => {
  try {
    loading.value = true
    const { data: memberData, error: memberError } = await supabase
      .from('users')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (memberError) throw memberError
    member.value = memberData

    const { data: participationsData, error: participationsError } = await supabase
      .from('participations')
      .select(`
        id,
        type,
        attended,
        role,
        class,
        created_at,
        event:events(
          id,
          title,
          datetime,
          event_type:event_types(
            dkp
          )
        )
      `)
      .eq('member_id', route.params.id)
      .order('created_at', { ascending: false })

    if (participationsError) throw participationsError
    participations.value = participationsData
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch member details'
    console.error('Error fetching member details:', e)
  } finally {
    loading.value = false
  }
}

// Calculate DKP earned for a participation
const calculateDKPEarned = (participation: Participation): number => {
  if (participation.type === 'accept' && participation.attended === true) {
    return participation.event?.event_type?.dkp || 0
  }
  return 0
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fetch data when component is mounted
onMounted(() => {
  fetchMemberDetails()
})

const columns: TableColumn<Participation>[] = [{
  accessorKey: 'event.title',
  header: () => h('div', 'Event'),
  cell: ({ row }) => h('div', row.original.event?.title || 'N/A')
}, {
  accessorKey: 'event.datetime',
  header: () => h('div', 'Date'),
  cell: ({ row }) => h('div', formatDate(row.original.event?.datetime || row.original.created_at))
}, {
  accessorKey: 'type',
  header: () => h('div', 'Status'),
  cell: ({ row }) => {
    const type = row.original.type
    const attended = row.original.attended
    let color = 'gray'
    let text = type.charAt(0).toUpperCase() + type.slice(1)

    if (type === 'accept') {
      if (attended === true) {
        color = 'green'
        text = 'Attended'
      } else if (attended === false) {
        color = 'red'
        text = 'Missed'
      }
    }

    return h('div', { class: `text-${color}-500` }, text)
  }
}, {
  accessorKey: 'role',
  header: () => h('div', 'Role'),
  cell: ({ row }) => h('div', row.original.role || 'N/A')
}, {
  accessorKey: 'class',
  header: () => h('div', 'Class'),
  cell: ({ row }) => h('div', row.original.class || 'N/A')
}, {
  accessorKey: 'dkp',
  header: () => h('div', 'DKP Earned'),
  cell: ({ row }) => {
    const dkp = calculateDKPEarned(row.original)
    return h('div', { class: 'font-medium' }, dkp.toString())
  }
}]

const table = useTemplateRef('table')
</script>

<template>
  <div class="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ member?.server_name || 'Loading...' }}
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ member?.global_name }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500 dark:text-gray-400">Main Role</div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ member?.last_used_role?.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="p-4 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
      </div>
      
      <div v-else-if="error" class="p-4 text-center text-red-500">
        {{ error }}
      </div>
      
      <div v-else class="w-full overflow-x-auto p-0 m-0">
        <UTable
          ref="table"
          :data="participations"
          :columns="columns"
          class="w-full divide-y divide-gray-200 dark:divide-gray-700"
        >
          <template #empty>
            <div class="p-4 text-center text-gray-500 dark:text-gray-400">
              No participations found
            </div>
          </template>
        </UTable>
      </div>
    </div>
  </div>
</template>

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