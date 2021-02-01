import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // {
  //   path: '/catalog/:page',
  //   name: 'Catalog',
  //   props: true,
  //   component: () => import('@/views/Catalog.vue'),
  // },
  // {
  //   path: '/product/:id',
  //   name: 'Product',
  //   props: true,
  //   component: () => import('@/views/Product.vue'),
  // },
  // {
  //   path: '/cart',
  //   name: 'Cart',
  //   component: () => import('@/views/Cart.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
