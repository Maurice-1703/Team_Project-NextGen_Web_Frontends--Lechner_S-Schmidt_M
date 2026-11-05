<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useConferenceData } from '../composables/useConferenceData'

// id kommt vom Router (props: true in router/index.ts)
const props = defineProps<{ id: string }>()

// nur die benötigten Suchfunktionen aus der zentralen Datenschicht holen
const { getSessionById, getTrackById, getRoomById, getSpeakersBySessionId } = useConferenceData()

// computed statt const -> wird neu berechnet, sobald sich props.id ändert
// wichtig, weil Vue Router die Komponente bei /sessions/s01 -> /sessions/s02 wiederverwendet
const session = computed(() => getSessionById(props.id))

// Track aus der trackId ableiten
// Prüfung auf session nötig, weil session undefined sein kann
const track = computed(() =>
  session.value ? getTrackById(session.value.trackId) : undefined,
)

const room = computed(() =>
  session.value ? getRoomById(session.value.roomId) : undefined,
)

// Speaker der Session
// keine Prüfung auf session nötig -> Funktion liefert bei unbekannter ID ein leeres Array
const speakers = computed(() => getSpeakersBySessionId(props.id))
</script>


<template>
  <!-- Fall 1: Session gefunden -->
  <article v-if="session">
    <h1>{{ session.title }}</h1>
    <p>{{ session.abstract }}</p>

    <dl>
      <dt>Track</dt>
      <!-- ?. und ?? -> falls Track fehlt, Ersatztext statt Absturz -->
      <dd>{{ track?.name ?? 'Unbekannter Track' }}</dd>

      <dt>Raum</dt>
      <dd>{{ room?.name ?? 'Unbekannter Raum' }}</dd>

      <dt>Tag</dt>
      <dd>{{ session.day }}</dd>

      <dt>Zeit</dt>
      <dd>{{ session.startTime }}-{{ session.endTime }}</dd>

      <dt>Level</dt>
      <dd>{{ session.level }}</dd>

      <dt>Format</dt>
      <dd>{{ session.format }}</dd>
    </dl>

    <h2>Speaker</h2>
    <ul>
      <li v-for="speaker in speakers" :key="speaker.id">
        <RouterLink :to="{ name: 'speaker-detail', params: {id: speaker.id}}">{{ speaker.name }}</RouterLink>
      </li>
    </ul>
  </article>

  <!-- Fall 2: unbekannte ID, z. B. /sessions/s99 -->
  <section v-else>
    <h1>Session nicht gefunden</h1>
    <p>Zur ID „{{ id }}“ gibt es keine Session.</p>
    <RouterLink :to="{ name: 'sessions' }">Zur Sessionübersicht</RouterLink>
  </section>
</template>