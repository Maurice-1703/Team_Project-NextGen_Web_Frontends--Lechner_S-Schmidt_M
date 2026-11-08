<script setup lang="ts">
import type { SessionFilters } from '../../composables/useSessionFilter'
import type { SessionLevel, Track } from '../../types/conference'

defineProps<{
  tracks: readonly Track[]
  days: readonly string[]
  levels: readonly SessionLevel[]
}>()

const filters = defineModel<SessionFilters>({ required: true })
const emit = defineEmits<{ reset: [] }>()

function changeFilter(key: keyof SessionFilters, event: Event) {
  const select = event.target as HTMLSelectElement
  filters.value = { ...filters.value, [key]: select.value }
}
</script>

<template>
  <fieldset>
    <legend>Sessions filtern</legend>

    <label>
      Track
      <select :value="filters.track" @change="changeFilter('track', $event)">
        <option value="">Alle Tracks</option>
        <option v-for="track in tracks" :key="track.id" :value="track.id">
          {{ track.name }}
        </option>
      </select>
    </label>

    <label>
      Konferenztag
      <select :value="filters.day" @change="changeFilter('day', $event)">
        <option value="">Alle Tage</option>
        <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
      </select>
    </label>

    <label>
      Level
      <select :value="filters.level" @change="changeFilter('level', $event)">
        <option value="">Alle Level</option>
        <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
      </select>
    </label>

    <button type="button" @click="emit('reset')">Filter zurücksetzen</button>
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: var(--space-4);
  margin: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

label {
  display: grid;
  gap: var(--space-2);
}

select {
  max-width: 100%;
}
</style>