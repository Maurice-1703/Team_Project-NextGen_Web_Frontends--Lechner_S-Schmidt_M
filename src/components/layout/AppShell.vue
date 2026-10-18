<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import BrandingTest from '../BrandingTest.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <BrandingTest />
    <main>
      <!-- Inhalt der aktuellen View aufnehmen. -->
      <slot />
    </main>
  </div>
</template>