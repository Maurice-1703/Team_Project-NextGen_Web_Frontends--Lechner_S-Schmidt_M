import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQuery } from 'vue-router'
import type { Session } from '../types/conference'
import { useConferenceData } from './useConferenceData'

export interface SessionFilters {
  track: string
  day: string
  level: string
}

function readFilter(value: LocationQuery[string] | undefined, allowed: readonly string[]) {
  return typeof value === 'string' && allowed.includes(value) ? value : ''
}

function filterSessions(sessions: readonly Session[], filters: SessionFilters) {
  return sessions.filter((session) =>
    (!filters.track || session.trackId === filters.track) &&
    (!filters.day || session.day === filters.day) &&
    (!filters.level || session.level === filters.level),
  )
}

export function useSessionFilter() {
  const route = useRoute()
  const router = useRouter()
  const { sessions, tracks, days, levels } = useConferenceData()
  const trackIds = tracks.map(({ id }) => id)
  const mounted = ref(false)

  onMounted(() => {
    mounted.value = true
  })

  const activeFilters = computed<SessionFilters>({
    get() {
      if (!mounted.value) return { track: '', day: '', level: '' }

      return {
        track: readFilter(route.query.track, trackIds),
        day: readFilter(route.query.day, days),
        level: readFilter(route.query.level, levels),
      }
    },
    set(filters) {
      void router.push({
        query: {
          ...route.query,
          track: filters.track || undefined,
          day: filters.day || undefined,
          level: filters.level || undefined,
        },
        hash: route.hash,
      })
    },
  })

  const filtered = computed(() => filterSessions(sessions, activeFilters.value))

  function reset() {
    activeFilters.value = { track: '', day: '', level: '' }
  }

  return { activeFilters, filtered, reset }
}