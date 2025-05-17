<template>
  <div class="mt-12">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-white">Group Assignments</h2>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          @click="isEditing = !isEditing">
          {{ isEditing ? 'Done' : 'Edit' }}
        </button>
        <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          @click="isAttendanceMode ? handleAttendanceDone() : isAttendanceMode = true">
          {{ isAttendanceMode ? 'Done' : 'Attendance' }}
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(group, groupIndex) in displayedGroups" :key="groupIndex" class="bg-gray-800 rounded-lg p-2">
        <h3 class="text-lg font-semibold text-white mb-3">Group {{ groupIndex + 1 }}</h3>
        <div class="space-y-2">
          <div v-for="slot in 6" :key="slot"
            class="flex items-center gap-2 text-gray-300 border border-gray-600 rounded p-2"
            :class="{ 'cursor-move': isEditing && group[slot - 1] }" :draggable="isEditing && !!group[slot - 1]"
            @dragstart="group[slot - 1] && handleDragStart(group[slot - 1], groupIndex, slot - 1)"
            @dragover="handleDragOver" @drop="handleDrop(groupIndex, slot - 1)" @dragend="handleDragEnd">
            <template v-if="group[slot - 1]">
              <img :src="`/images/class_icons/${group[slot - 1].class.toLowerCase()}.png`" :alt="group[slot - 1].class"
                class="w-6 h-6">
              <span>{{ group[slot - 1].server_name }}</span>
              <div v-if="isAttendanceMode" class="ml-auto flex gap-2">
                <button class="w-6 h-6 rounded-full flex items-center justify-center"
                  :class="group[slot - 1].attended === true ? 'bg-green-500' : 'bg-gray-600 hover:bg-green-500'"
                  @click="handleAttendanceToggle(group[slot - 1], true)">
                  <span class="text-white">✓</span>
                </button>
                <button class="w-6 h-6 rounded-full flex items-center justify-center"
                  :class="group[slot - 1].attended === false ? 'bg-red-500' : 'bg-gray-600 hover:bg-red-500'"
                  @click="handleAttendanceToggle(group[slot - 1], false)">
                  <span class="text-white">✕</span>
                </button>
              </div>
              <div v-else-if="group[slot - 1].attended !== null" class="ml-auto">
                <span :class="group[slot - 1].attended ? 'text-green-500' : 'text-red-500'">
                  {{ group[slot - 1].attended ? '✓' : '✕' }}
                </span>
              </div>
            </template>
            <template v-else>
              <span class="text-gray-500">Empty slot</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Participant {
  id: string
  server_name: string
  role: 'tank' | 'heal' | 'dps'
  class: string
  attended: boolean | null
}

interface Props {
  participants: Participant[]
}

const props = defineProps<Props>()

const isEditing = ref(false)
const isAttendanceMode = ref(false)
const draggedParticipant = ref<{ participant: Participant, sourceGroup: number, sourceSlot: number } | null>(null)
const attendanceChanges = ref<Map<string, boolean>>(new Map())

const assignedGroups = ref<Participant[][]>([])

// Initialize groups
const initializeGroups = () => {
  const groups: Participant[][] = []
  const remainingParticipants = [...props.participants]

  // Create up to 8 groups
  for (let i = 0; i < 8 && remainingParticipants.length > 0; i++) {
    const newGroup: Participant[] = []
    groups.push(newGroup)

    // Add up to 6 participants to the group
    const participantsToAdd = Math.min(6, remainingParticipants.length)
    for (let j = 0; j < participantsToAdd; j++) {
      newGroup.push(remainingParticipants.shift()!)
    }
  }

  // Ensure we always have 8 groups
  while (groups.length < 8) {
    groups.push([])
  }

  assignedGroups.value = groups
}

// Initialize groups on component mount
initializeGroups()

const displayedGroups = computed(() => {
  return isEditing.value ? assignedGroups.value : assignedGroups.value.filter(group => group.length > 0)
})

const handleDragStart = (participant: Participant, groupIndex: number, slotIndex: number) => {
  if (!isEditing.value) return
  draggedParticipant.value = { participant, sourceGroup: groupIndex, sourceSlot: slotIndex }
}

const handleDragOver = (e: DragEvent) => {
  if (!isEditing.value) return
  e.preventDefault()
}

const handleDrop = (targetGroupIndex: number, targetSlotIndex: number) => {
  if (!isEditing.value || !draggedParticipant.value) return

  const { participant, sourceGroup, sourceSlot } = draggedParticipant.value

  // If dropping on an occupied slot, swap the participants
  if (assignedGroups.value[targetGroupIndex][targetSlotIndex]) {
    const targetParticipant = assignedGroups.value[targetGroupIndex][targetSlotIndex]
    assignedGroups.value[targetGroupIndex][targetSlotIndex] = participant
    assignedGroups.value[sourceGroup][sourceSlot] = targetParticipant
  } else {
    // Remove from source
    assignedGroups.value[sourceGroup].splice(sourceSlot, 1)
    // Add to target
    assignedGroups.value[targetGroupIndex][targetSlotIndex] = participant
  }

  draggedParticipant.value = null
}

const handleDragEnd = () => {
  draggedParticipant.value = null
}

const handleAttendanceToggle = (participant: Participant, value: boolean) => {
  if (!isAttendanceMode.value) return
  participant.attended = value
  attendanceChanges.value.set(participant.id, value)
}

const handleAttendanceDone = async () => {
  try {
    // Update all changed attendance records
    const updates = Array.from(attendanceChanges.value.entries()).map(([id, attended]) => ({
      id,
      attended
    }))

    if (updates.length > 0) {
      const response = await fetch('/api/participations/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates })
      })

      if (!response.ok) {
        throw new Error('Failed to update attendance')
      }
    }

    // Clear changes and exit attendance mode
    isAttendanceMode.value = false
    attendanceChanges.value.clear()
  } catch (error) {
    console.error('Error updating attendance:', error)
    // Revert all changes on error
    attendanceChanges.value.forEach((value, id) => {
      const participant = assignedGroups.value.flat().find(p => p?.id === id)
      if (participant) {
        participant.attended = !value
      }
    })
    attendanceChanges.value.clear()
  }
}
</script>