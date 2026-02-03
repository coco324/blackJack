import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import game from '../views/game.vue';
import registration from '../views/registration.vue';
import login from '../views/login.vue';
import rules from '../views/rules.vue';
import Leaderboard from '../views/leaderboard.vue';
import Admin from '../views/admin.vue';
import examInsert from '../views/examInsert.vue';
import examList from '../views/examList.vue';

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
    },
    {
      path: '/rules',
      component: rules,
    },
    {
      path: '/leaderboard',
      component: Leaderboard,
    },
    {
      path: '/admin',
      component: Admin
    },
    {
      path: '/examInsert',
      component: examInsert
    },
    {
      path: '/examList',
      component: examList
    }
  ],
})

export default router;