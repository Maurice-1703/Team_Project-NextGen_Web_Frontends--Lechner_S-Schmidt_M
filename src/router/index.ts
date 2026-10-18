import { createRouter, createWebHistory } from 'vue-router'

import SessionsView from '../views/SessionsView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import SpeakersView from '../views/SpeakersView.vue'
import SpeakerDetailView from '../views/SpeakerDetailView.vue'
import MyProgramView from '../views/MyProgramView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import BrandingView from '../views/BrandingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/branding',
    },
    {
      path: '/branding',
      name: 'branding',
      component: BrandingView,
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView,
    },
    {
      path: '/sessions/:id',
      name: 'session-detail',
      component: SessionDetailView,
      props: true,
    },
    {
      path: '/speakers',
      name: 'speakers',
      component: SpeakersView,
    },
    {
      path: '/speakers/:id',
      name: 'speaker-detail',
      component: SpeakerDetailView,
      props: true,
    },
    {
      path: '/my-program',
      name: 'my-program',
      component: MyProgramView,
    },

    // Unbekannte Adressen zur Fehlerseite führen.
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router