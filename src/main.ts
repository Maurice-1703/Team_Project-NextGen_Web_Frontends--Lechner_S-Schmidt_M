import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { useConferenceData } from './composables/useConferenceData'
import { routes } from './router'

import '../tokens/tokens.css'
import './styles/base.css'

// Der Service Worker kann index.html für eine andere URL liefern.
// Nur passendes SSG-Markup hydrieren. Die Startseite rendert bereits /sessions.
const canHydrate = import.meta.env.PROD && !import.meta.env.SSR && (
  location.pathname === '/' ||
  document.querySelector('#app > [data-rendered-path]')?.getAttribute('data-rendered-path') === location.pathname
)

export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  undefined,
  { hydration: canHydrate, useHead: false },
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
