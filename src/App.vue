<script setup lang="ts">
import { provide } from 'vue'
import { RouterView } from 'vue-router'
import AppShell from './components/layout/AppShell.vue'
import { createMyProgramStore, myProgramKey } from './stores/myProgram'

// Store genau einmal pro App erzeugen
// provide -> alle Komponenten unterhalb von App.vue können ihn per inject holen
const myProgram = createMyProgramStore()
provide(myProgramKey, myProgram)
</script>

<template>
  <AppShell>
    <!-- Die zur URL passende View anzeigen -->
    <RouterView />
  </AppShell>
</template>