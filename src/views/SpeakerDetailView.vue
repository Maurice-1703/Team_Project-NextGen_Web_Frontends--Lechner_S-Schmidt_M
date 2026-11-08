<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SessionCard from '../components/feature/SessionCard.vue'
import { useConferenceData } from '../composables/useConferenceData'
import NotFoundView from './NotFoundView.vue'

const props = defineProps<{ id: string }>()
const { getSpeakerById, getSessionsBySpeakerId } = useConferenceData()

const speaker = computed(() => getSpeakerById(props.id))
const sessions = computed(() => getSessionsBySpeakerId(props.id))
</script>

<template>
  <section v-if="speaker" class="speaker-profile">
    <RouterLink :to="{ name: 'speakers' }">Zur Speakerübersicht</RouterLink>

    <header>
      <h1>{{ speaker.name }}</h1>
      <p>{{ speaker.title }} · {{ speaker.company }}</p>
    </header>

    <p>{{ speaker.bio }}</p>

    <h2>Sessions</h2>
    <ul class="session-list" role="list">
      <li v-for="session in sessions" :key="session.id">
        <SessionCard :session="session" />
      </li>
    </ul>
  </section>

  <NotFoundView v-else />
</template>

<style scoped>
.speaker-profile,
.session-list {
  display: grid;
  gap: var(--space-4);
}

.session-list {
  padding: 0;
  list-style: none;
}
</style>