<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { RouterView } from 'vue-router'
import AppShell from './components/layout/AppShell.vue'
import { createMyProgramStore, myProgramKey } from './stores/myProgram'

// Store genau einmal pro App erzeugen
// provide -> alle Komponenten unterhalb von App.vue können ihn per inject holen
const myProgram = createMyProgramStore()
provide(myProgramKey, myProgram)

// erst nach dem Mounten im Browser einlesen (Konzept C, ADR)
// beim vite-ssg-Build läuft onMounted nicht -> kein Zugriff auf localStorage in Node
// dadurch rendern Build und erster Browser-Durchlauf gleich -> kein Hydration-Mismatch
onMounted(() => {
  myProgram.init()
})
</script>

<template>
  <AppShell>
    <!-- Die zur URL passende View anzeigen -->
    <RouterView />
  </AppShell>
</template>