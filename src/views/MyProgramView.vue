<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useMyProgram } from '../stores/myProgram'
import { useConferenceData } from '../composables/useConferenceData'
import AddToProgramButton from '../components/feature/AddToProgramButton.vue'

// aus dem Store: sortierte Sessions, Ladezustand, Fehlerhinweis
// Destructuring -> alles direkt im Template nutzbar (ohne .value)
const { selectedSessions, isReady, storageError } = useMyProgram()

// aus der Datenschicht: Raumname zur roomId nachschlagen
const { getRoomById } = useConferenceData()
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
    <ul v-else>
      <li v-for="session in selectedSessions" :key="session.id">

         <RouterLink :to="{name: 'session-detail', params: {id: session.id}}">{{ session.title }}</RouterLink>
         <dl>
          <dt>Zeit</dt>
          <dd>{{ session.day }}, {{ session.startTime }}-{{ session.endTime }}</dd>

          <dt>Raum</dt>
          <dd>{{ getRoomById(session.roomId)?.name ?? "Raum unbekannt" }}</dd>
        </dl>
        <!-- auf dieser Seite ist jede Session ausgewählt, Button zeigt automatisch „Aus meinem Programm entfernen“ -->
         <AddToProgramButton :session-id="session.id" />
      </li>
    </ul>
  </section>
</template>