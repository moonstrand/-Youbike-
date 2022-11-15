import { createRouter, createWebHashHistory } from 'vue-router';
import YoubikeStatus from '../views/YoubikeStatus.vue';

const routes = [
  {
    path: '/',
    name: 'YoubikeStatus',
    component: YoubikeStatus,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
