<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppShell from './components/layout/AppShell.vue'
</script>

<template>
  <AppShell>
    <!-- Die zur URL passende View anzeigen. -->
    <RouterView />
  </AppShell>
</template>