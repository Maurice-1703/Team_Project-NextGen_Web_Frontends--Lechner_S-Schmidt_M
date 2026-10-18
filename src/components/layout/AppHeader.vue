<script setup lang="ts">
import AppNav from './AppNav.vue'
</script>

<template>
  <header>
    <p class="brand">CouchCoding</p>
    <AppNav />
  </header>
</template>

<style scoped>
header {
  display: grid;
  gap: var(--space-4);
  padding-block: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.brand {
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}
</style>