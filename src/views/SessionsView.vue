<script setup lang="ts">
import SessionCard from '../components/feature/SessionCard.vue'
import SessionFilterBar from '../components/feature/SessionFilterBar.vue'
import { useConferenceData } from '../composables/useConferenceData'
import { useSessionFilter } from '../composables/useSessionFilter'

const { conference, sessions, tracks, days, levels } = useConferenceData()
const { activeFilters, filtered, reset } = useSessionFilter()
</script>

<template>
  <section class="sessions">
    <h1>Sessions der {{ conference.name }}</h1>

    <SessionFilterBar
      v-model="activeFilters"
      :tracks="tracks"
      :days="days"
      :levels="levels"
      @reset="reset"
    />

    <h2>Sessionliste</h2>
    <p role="status">{{ filtered.length }} von {{ sessions.length }} Sessions</p>
    <p v-if="filtered.length === 0">Keine Sessions passen zu diesen Filtern.</p>

    <ul v-else class="session-list" role="list">
      <li v-for="session in filtered" :key="session.id">
        <SessionCard :session="session" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.sessions,
.session-list {
  display: grid;
  gap: var(--space-4);
}

.session-list {
  padding: 0;
  list-style: none;
}
</style>