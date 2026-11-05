<script setup lang="ts">
import { useMyProgram } from '../stores/myProgram'

// Destructuring -> selectedIds direkt im Template nutzbar
const { selectedIds, storageError } = useMyProgram()
</script>

<template>
  <section>
    <h1>Mein Couch-Programm</h1>
    <!-- vorerst nur zum Testen: rohe ID-Liste -->
    <p>Ausgewählte IDs: {{ selectedIds }}</p>
    <p>{{ storageError }}</p>
  </section>
</template>