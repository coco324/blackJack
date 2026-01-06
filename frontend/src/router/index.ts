import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import game from '../views/game.vue';
import registration from '../views/registration.vue';
import login from '../views/login.vue';

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
    },
    {
      path: '/registration',
      component: registration,
    },
    {
      path: '/login',
      component: login,
    }
  ],
})

export default router;