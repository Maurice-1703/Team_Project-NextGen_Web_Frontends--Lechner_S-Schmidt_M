import type { RouteRecordRaw } from 'vue-router'

import SessionsView from '../views/SessionsView.vue'
import SessionDetailView from '../views/SessionDetailView.vue'
import SpeakersView from '../views/SpeakersView.vue'
import SpeakerDetailView from '../views/SpeakerDetailView.vue'
import MyProgramView from '../views/MyProgramView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import BrandingView from '../views/BrandingView.vue'

export const routes: RouteRecordRaw[] = [
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
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]