<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <section>
    <h1>Sessiondetails</h1>

    <!-- Die ID wird vom Router übergeben. -->
    <p>Session-ID: {{ id }}</p>
    <p>Die Detailansicht folgt.</p>
  </section>
</template>