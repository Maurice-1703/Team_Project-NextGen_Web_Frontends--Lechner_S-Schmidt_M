<script setup lang="ts">
//Session über den gemeinsamen Store hinzufügen oder entfernen
import { computed } from 'vue'
import { useMyProgram } from '../../stores/myProgram'

const props = defineProps<{ sessionId: string }>()

// derselbe Store wie überall in der App
const program = useMyProgram()

// ausgewählt? -> computed, damit sich der Button bei jeder Änderung selbst aktualisiert
const selected = computed(() => program.isSelected(props.sessionId))

// Klick auf den Button: Zustand umschalten
// bereits ausgewählt -> entfernen, sonst -> hinzufügen
function toggle(): void {
  if (selected.value) {
    program.removeSession(props.sessionId)
  } else {
    program.addSession(props.sessionId)
  }
}
</script>

<template>
  <button type="button" @click="toggle">
    <!-- Beschriftung je nach Zustand -> ternärer Operator: bedingung ? wennJa : wennNein -->
    {{ selected ? 'Aus meinem Programm entfernen' : 'Zu meinem Programm hinzufügen' }}
  </button>
</template>
