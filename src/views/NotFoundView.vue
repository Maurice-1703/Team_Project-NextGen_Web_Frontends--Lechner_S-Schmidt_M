<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section>
    <h1>Seite nicht gefunden</h1>
    <p>Unter dieser Adresse gibt es keine Seite.</p>
    <RouterLink to="/sessions">Zur Sessionübersicht</RouterLink>
  </section>
</template>