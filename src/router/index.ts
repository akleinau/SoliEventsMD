import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Kontakt from '../views/Kontakt.vue'
import Datenschutz from '../views/Datenschutz.vue'
import Impressum from '../views/Impressum.vue'

const routes = [
  // ... bestehende Routen
  { path: '/', name: 'Home', component: Home },
  { path: '/home', name: 'Home', component: Home },
  { path: '/kontakt', name: 'Kontakt', component: Kontakt },
  { path: '/datenschutz', name: 'Datenschutz', component: Datenschutz },
  { path: '/impressum', name: 'Impressum', component: Impressum },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;