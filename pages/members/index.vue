<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

definePageMeta({
  middleware: ['auth']
})

type Member = {
  id: string
  server_name: string
  DKP: number
  global_name: string
  last_used_role: string | null
  last_used_class: string | null
}

type Participation = {
  type: 'accept' | 'maybe' | 'refuse'
  attended: boolean | null
  event: {
    event_type: {
      dkp: number
    } | null
  } | null
}

type MemberWithParticipations = {
  id: string
  server_name: string
  participations: Participation[]
}

const supabase = useSupabaseClient()
const data = ref<Member[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Calculate total DKP for a member based on their participations
const calculateTotalDKP = (participations: Participation[]): number => {
  return participations.reduce((sum: number, participation: Participation) => {
    if (participation.type === 'accept' && participation.attended === true) {
      return sum + (participation.event?.event_type?.dkp || 0)
    }
    return sum
  }, 0)
}

// Fetch members from Supabase
const fetchMembers = async () => {
  try {
    loading.value = true
    const { data: members, error: fetchError } = await supabase
      .from('users')
      .select(`
        id,
        server_name,
        participations(
          type,
          attended,
          event:events(
            event_type:event_types(
              dkp
            )
          )
        ),
        global_name,
        last_used_role,
        last_used_class
      `)
      .order('server_name', { ascending: true })
      .overrideTypes<MemberWithParticipations[]>()

    if (fetchError) throw fetchError

    data.value = members.map(member => ({
      id: member.id,
      server_name: member.server_name,
      DKP: calculateTotalDKP(member.participations),
      global_name: member.global_name,
      last_used_role: member.last_used_role,
      last_used_class: member.last_used_class
    }))
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch members'
    console.error('Error fetching members:', e)
  } finally {
    loading.value = false
  }
}

// Fetch members when component is mounted
onMounted(() => {
  fetchMembers()
})

const columns: TableColumn<Member>[] = [{
  accessorKey: 'server_name',
  header: () => h('div', 'Nickname'),
  enableSorting: false,
  cell: ({ row }) => h('div', row.getValue('server_name'))
}, {
  accessorKey: 'DKP',
  header: ({ column }) => {
    const isSorted = column.getIsSorted()
    return h('div', [
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'DKP',
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    ])
  },
  cell: ({ row }) => {
    const dkp = Number.parseFloat(row.getValue('DKP'))
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(dkp)
    return h('div', { class: 'font-medium' }, formatted)
  }
}, {
  id: 'actions',
  enableHiding: false,
  cell: ({ row }) => {
    const router = useRouter()
    const items = [{
      type: 'label',
      label: 'Actions'
    }, {
      label: row.getIsExpanded() ? 'Collapse' : 'Expand',
      onSelect() {
        row.toggleExpanded()
      }
    }, {
      type: 'separator'
    }, {
      label: 'View member',
      onSelect() {
        router.push(`/members/${row.original.id}`)
      }
    }]

    return h('div', { class: 'text-right' }, h(UDropdownMenu, {
      'content': {
        align: 'end'
      },
      items,
      'aria-label': 'Actions dropdown'
    }, () => h(UButton, {
      'icon': 'i-lucide-ellipsis-vertical',
      'color': 'neutral',
      'variant': 'ghost',
      'class': 'ml-auto',
      'aria-label': 'Actions dropdown'
    })))
  }
}]

const table = useTemplateRef('table')
</script>

<template>
  <div class="p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Guild Members</h1>
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
          :data="data"
          :columns="columns"
          class="w-full divide-y divide-gray-200 dark:divide-gray-700"
        >
          <template #expanded="{ row }">
            <div class="p-4 bg-gray-50 dark:bg-gray-800">
              <pre class="text-sm text-gray-600 dark:text-gray-300">{{ row.original }}</pre>
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