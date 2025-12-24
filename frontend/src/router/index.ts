import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import game from '../views/game.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: home,
    },
    {
      path: '/game',
      component: game,
    }
  ],
})

export default router;