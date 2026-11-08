<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useConferenceData } from '../../composables/useConferenceData'
import type { Session } from '../../types/conference'

defineProps<{ session: Session }>()

const { getTrackById, getRoomById } = useConferenceData()
</script>

<template>
  <article>
    <h3>
      <RouterLink :to="{ name: 'session-detail', params: { id: session.id } }">
        {{ session.title }}
      </RouterLink>
    </h3>
    <p>
      <time :datetime="session.day">{{ session.day }}</time>
      · {{ session.startTime }}–{{ session.endTime }}
      · {{ getRoomById(session.roomId)?.name }}
    </p>
    <p>
      {{ getTrackById(session.trackId)?.name }} · {{ session.level }} · {{ session.format }}
    </p>
  </article>
</template>

<style scoped>
article {
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

p + p {
  margin-top: var(--space-2);
}
</style>