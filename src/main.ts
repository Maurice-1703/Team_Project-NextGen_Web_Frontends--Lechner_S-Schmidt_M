import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { useConferenceData } from './composables/useConferenceData'
import { routes } from './router'

import '../tokens/tokens.css'
import './styles/base.css'

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  undefined,
  { hydration: import.meta.env.PROD, useHead: false },
)

export function includedRoutes(paths: string[]) {
  const { sessions, speakers } = useConferenceData()

  return paths.flatMap((path) => {
    if (path === '/sessions/:id') {
      return sessions.map(({ id }) => `/sessions/${id}`)
    }
    if (path === '/speakers/:id') {
      return speakers.map(({ id }) => `/speakers/${id}`)
    }
    return path.includes(':') || path.includes('*') ? [] : [path]
  })
}