import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/topic',
    name: 'TopicPlanning',
    component: () => import('../views/TopicPlanning.vue'),
  },
  {
    path: '/create',
    name: 'ContentCreate',
    component: () => import('../views/ContentCreate.vue'),
  },
  {
    path: '/review',
    name: 'ContentReview',
    component: () => import('../views/ContentReview.vue'),
  },
  {
    path: '/analysis',
    name: 'DataAnalysis',
    component: () => import('../views/DataAnalysis.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router