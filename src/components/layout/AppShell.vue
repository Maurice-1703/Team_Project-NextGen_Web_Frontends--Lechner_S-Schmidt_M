<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    
    <main>
      <!-- Inhalt der aktuellen View aufnehmen. -->
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 960px;
  margin-inline: auto;
  padding-inline: var(--space-4);
}

main {
  padding-block: var(--space-8);
}
</style>