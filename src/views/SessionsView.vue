<script setup lang="ts">
import { useConferenceData } from '../composables/useConferenceData'

const { conference, sessions } = useConferenceData()
</script>

<template>
  <section>
    <h1>Sessions der {{ conference.name }}</h1>

    <!-- Nachweis für den eingelesenen Datensatz. -->
    <p>{{ sessions.length }} Sessions im Datensatz.</p>
    <p>Suche und Filter folgen.</p>
  </section>
</template>