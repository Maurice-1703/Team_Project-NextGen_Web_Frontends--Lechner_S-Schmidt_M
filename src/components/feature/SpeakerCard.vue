<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Speaker } from '../../types/conference'

defineProps<{ speaker: Speaker }>()
</script>

<template>
  <article>
    <h2>
      <RouterLink :to="{ name: 'speaker-detail', params: { id: speaker.id } }">
        {{ speaker.name }}
      </RouterLink>
    </h2>
    <p>{{ speaker.title }} · {{ speaker.company }}</p>
  </article>
</template>