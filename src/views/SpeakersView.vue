<script setup lang="ts">
import SpeakerCard from '../components/feature/SpeakerCard.vue'
import { useConferenceData } from '../composables/useConferenceData'

const { speakers } = useConferenceData()
</script>

<template>
  <section class="speakers">
    <h1>Speaker</h1>
    <ul class="speaker-list" role="list">
      <li v-for="speaker in speakers" :key="speaker.id">
        <SpeakerCard :speaker="speaker" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.speakers,
.speaker-list {
  display: grid;
  gap: var(--space-4);
}

.speaker-list {
  padding: 0;
  list-style: none;
}
</style>