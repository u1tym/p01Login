import { createRouter, createWebHistory } from 'vue-router'
import { BASE_URL } from '@/config/urls'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

export default router

