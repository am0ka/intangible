<template>
  <USelectMenu v-model="selectedClass" :items="classes" placeholder="Choose your class" class="w-full" :ui="{
    base: 'bg-gray-700 text-gray-300 border-gray-600',
  }">
    <template #default="{ modelValue: value }">
      <div v-if="value" class="flex items-center gap-2">
        <img :src="`/images/class_icons/${value}.png`" :alt="value" class="w-5 h-5 object-contain">
        <span>{{ value.charAt(0).toUpperCase() + value.slice(1) }}</span>
      </div>
      <span v-else class="text-gray-400">Choose your class</span>
    </template>
    <template #item="{ item }">
      <div class="flex items-center gap-2">
        <img :src="`/images/class_icons/${item}.png`" :alt="item" class="w-5 h-5 object-contain">
        <span>{{ item.charAt(0).toUpperCase() + item.slice(1) }}</span>
      </div>
    </template>

  </USelectMenu>
</template>

<script setup lang="ts">
const classes = [
  'battleweaver',
  'berserker',
  'cavalier',
  'crusader',
  'darkblighter',
  'disciple',
  'eradicator',
  'fury',
  'gladiator',
  'impaler',
  'infiltrator',
  'invocator',
  'liberator',
  'outrider',
  'paladin',
  'raider',
  'ranger',
  'ravager',
  'scorpion',
  'scout',
  'seeker',
  'sentinel',
  'shadowdancer',
  'spellblade',
  'steelheart',
  'templar',
  'voidlance',
  'warden'
]

const props = defineProps<{
  modelValue: string | null
}>()

const selectedClass = computed({
  get: () => props.modelValue ?? undefined,
  set: (value) => emit('update:modelValue', value ?? null)
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

</script>