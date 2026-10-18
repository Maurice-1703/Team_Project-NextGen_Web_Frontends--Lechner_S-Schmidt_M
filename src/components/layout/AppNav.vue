<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav aria-label="Hauptnavigation">
    <RouterLink to="/branding">Branding</RouterLink>
    <RouterLink to="/sessions">Sessions</RouterLink>
    <RouterLink to="/speakers">Speaker</RouterLink>
    <RouterLink to="/my-program">Mein Couch-Programm</RouterLink>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.router-link-active {
  font-weight: var(--font-weight-bold);
}
</style>