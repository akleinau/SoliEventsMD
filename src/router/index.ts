import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Kontakt from '../views/Kontakt.vue'
import Datenschutz from '../views/Datenschutz.vue'
import Impressum from '../views/Impressum.vue'

const routes = [
  // ... bestehende Routen
  { path: '', name: 'Main', component: Home },
  { path: '/', name: 'Start', component: Home },
  { path: '/home', name: 'Home', component: Home },
  { path: '/kontakt', name: 'Kontakt', component: Kontakt },
  { path: '/datenschutz', name: 'Datenschutz', component: Datenschutz },
  { path: '/impressum', name: 'Impressum', component: Impressum },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;