import { createRouter, createWebHashHistory } from 'vue-router'

import Start from '../views/Start.vue'
import Home from '../views/Home.vue'
import Kontakt from '../views/Kontakt.vue'
import Datenschutz from '../views/Datenschutz.vue'
import Impressum from '../views/Impressum.vue'

const routes = [
  // ... bestehende Routen
  { path: '', name: 'Main', component: Start },
  { path: '/', name: 'Start', component: Start },  
  { path: '/:category', component: Home },
  { path: '/kontakt', name: 'Kontakt', component: Kontakt },
  { path: '/datenschutz', name: 'Datenschutz', component: Datenschutz },
  { path: '/impressum', name: 'Impressum', component: Impressum },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router;