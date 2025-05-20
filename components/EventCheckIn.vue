<template>
  <div>
    <button
      class="text-sm sm:text-base bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      @click="isModalOpen = true">
      Check-in
    </button>

    <!-- Check-in Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-white">Check-in for {{ event.title }}</h3>
          <button class="text-gray-400 hover:text-white" @click="closeModal">
            <span class="sr-only">Close</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Role Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-300 mb-2">Select your role</label>
          <div class="grid grid-cols-3 gap-3">
            <button v-for="role in roles" :key="role.value" :class="[
              'py-2 px-3 rounded text-sm font-medium transition-colors',
              selectedRole === role.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            ]" @click="selectedRole = role.value">
              {{ role.label }}
            </button>
          </div>
        </div>

        <!-- Class Selection -->
        <ClassSelect v-model="selectedClass" class="mb-6" />

        <!-- Action Buttons -->
        <div class="flex flex-col gap-2">
          <button :disabled="!selectedRole || !selectedClass" :class="[
            'w-full py-2 px-4 rounded text-sm font-medium transition-colors',
            selectedRole && selectedClass
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          ]" @click="handleParticipate">
            Participate
          </button>
          <button
            class="w-full py-2 px-4 rounded text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            @click="handleMaybe">
            Maybe
          </button>
          <button
            class="w-full py-2 px-4 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            @click="handleRefuse">
            Refuse
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types/event'
import type { Database } from '~/supabase/database.types'

const props = defineProps<{ event: Event }>()

const isModalOpen = ref(false)
const selectedRole = ref<string | null>(null)
const selectedClass = ref<string | null>(null)

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const toast = useToast()

// Watch for modal state changes to handle body scroll
watch(isModalOpen, (newValue) => {
  if (import.meta.client) {
    document.body.style.overflow = newValue ? 'hidden' : ''
  }
})

// Clean up on component unmount
onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})

const roles = [
  { label: 'Tank', value: 'tank' },
  { label: 'DPS', value: 'dps' },
  { label: 'Heal', value: 'heal' }
]

const handleParticipate = async () => {
  if (!selectedRole.value || !selectedClass.value || !user.value) return

  try {
    // Get user's database ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', user.value.user_metadata.provider_id)
      .single()

    if (userError) throw userError

    // Update user's last used role and class
    const { error: updateError } = await supabase
      .from('users')
      .update({
        last_used_role: selectedRole.value as 'tank' | 'dps' | 'heal',
        last_used_class: selectedClass.value
      })
      .eq('id', userData.id)

    if (updateError) throw updateError

    // Create participation record
    const { error: participationError } = await supabase
      .from('participations')
      .upsert({
        event_id: props.event.id,
        member_id: userData.id,
        type: 'accept' as const,
        role: selectedRole.value,
        class: selectedClass.value
      })

    if (participationError) throw participationError

    toast.success({
      title: 'Success',
      message: 'You have successfully checked in for the event!',
      position: "bottomRight"
    })
  } catch (error) {
    console.error('Error checking in:', error)
    toast.success({
      title: 'Error',
      message: 'Failed to check in for the event. Please try again.',
      position: "bottomRight"
    })
  }

  isModalOpen.value = false
}

const handleRefuse = async () => {
  if (!user.value) return

  try {
    // Get user's database ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', user.value.user_metadata.provider_id)
      .single()

    if (userError) throw userError

    // Create participation record
    const { error: participationError } = await supabase
      .from('participations')
      .upsert({
        event_id: props.event.id,
        member_id: userData.id,
        type: 'refuse' as const
      })

    if (participationError) throw participationError

    toast.success({
      title: 'Success',
      message: 'You have declined the event.',
      position: "bottomRight"
    })
  } catch (error) {
    console.error('Error declining event:', error)
    toast.success({
      title: 'Error',
      message: 'Failed to decline the event. Please try again.',
      position: "bottomRight"
    })
  }

  isModalOpen.value = false
}

const handleMaybe = async () => {
  if (!user.value) return

  try {
    // Get user's database ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', user.value.user_metadata.provider_id)
      .single()

    if (userError) throw userError

    // Create participation record
    const { error: participationError } = await supabase
      .from('participations')
      .upsert({
        event_id: props.event.id,
        member_id: userData.id,
        type: 'maybe' as const
      })

    if (participationError) throw participationError

    toast.success({
      title: 'Success',
      message: 'You have marked yourself as maybe for the event.',
      position: "bottomRight"
    })
  } catch (error) {
    console.error('Error marking maybe:', error)
    toast.success({
      title: 'Error',
      message: 'Failed to mark yourself as maybe. Please try again.',
      position: "bottomRight"
    })
  }

  isModalOpen.value = false
}

const closeModal = () => {
  selectedRole.value = null
  selectedClass.value = null
  isModalOpen.value = false
}
</script>