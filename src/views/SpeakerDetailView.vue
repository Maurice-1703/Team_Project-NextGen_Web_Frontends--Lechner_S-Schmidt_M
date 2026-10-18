<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <section>
    <h1>Speakerprofil</h1>

    <!-- Die ID wird vom Router übergeben. -->
    <p>Speaker-ID: {{ id }}</p>
    <p>Das Speakerprofil folgt.</p>
  </section>
</template>