<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useMyProgram } from '../stores/myProgram'
import { useConferenceData } from '../composables/useConferenceData'
import AddToProgramButton from '../components/feature/AddToProgramButton.vue'

// aus dem Store: sortierte Sessions, Ladezustand, Fehlerhinweis
// Destructuring -> alles direkt im Template nutzbar (ohne .value)
const { selectedSessions, isReady, storageError } = useMyProgram()

// aus der Datenschicht: Raumname zur roomId nachschlagen
const { getRoomById } = useConferenceData()

// Sessions nach Tag gruppieren -> [{ day: '2026-09-15', sessions: [...] }, ...]
// Reihenfolge bleibt erhalten, weil selectedSessions schon nach Tag + Zeit sortiert ist
const sessionsByDay = computed(() => {
  // Map: Tag -> Sessions dieses Tages
  const groups = new Map<string, typeof selectedSessions.value>()

  for (const session of selectedSessions.value) {
    // vorhandene Liste für diesen Tag holen oder neue anlegen
    const list = groups.get(session.day) ?? []
    list.push(session)
    groups.set(session.day, list)
  }

  // Map in ein Array aus { day, sessions } umwandeln -> im Template mit v-for nutzbar
  return [...groups.entries()].map(([day, sessions]) => ({ day, sessions }))
})
</script>

<template>
  <section>
    <h1>Mein Couch-Programm</h1>

    <!-- Fehlerhinweis unabhängig von den anderen Zuständen -->
    <!-- role="status" -> Screenreader liest die Meldung vor -->
    <p v-if="storageError" role="status">{{ storageError }}</p>


    <!-- Zustand 1: noch nicht eingelesen (z. B. vorgerenderte Hülle bei vite-ssg) -->
    <p v-if="!isReady">Deine Auswahl wird geladen …</p>

    <!-- Zustand 2: eingelesen, aber leer -->
    <div v-else-if="selectedSessions.length === 0">
       <p> Du hast noch keine Sessions hinzugefügt:
        <RouterLink :to="{name: 'sessions'}">Zur Übersicht</RouterLink>
      </p>
    </div>

    <!-- Zustand 3: Liste -->
    <template v-else>
      <section v-for="group in sessionsByDay" :key="group.day">
        <h2>{{ group.day }}</h2>
        <ul>
          <li v-for="session in group.sessions" :key="session.id">
            <RouterLink :to="{name: 'session-detail', params: {id: session.id}}">{{ session.title }}</RouterLink>
            <dl>
              <dt>Zeit</dt>
              <dd>{{ session.startTime }}-{{ session.endTime }}</dd>

              <dt>Raum</dt>
              <dd>{{ getRoomById(session.roomId)?.name ?? "Raum unbekannt" }}</dd>
            </dl>
            <!-- auf dieser Seite ist jede Session ausgewählt, Button zeigt automatisch „Aus meinem Programm entfernen“ -->
            <AddToProgramButton :session-id="session.id" />
          </li>
        </ul>
      </section>
    </template>
  </section>
</template>