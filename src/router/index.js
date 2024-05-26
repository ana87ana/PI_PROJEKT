import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Songs from '@/views/songs.vue';
import SongsFiltered from '@/views/songs_filtered.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'S',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Signup.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/accout_page.vue')
  },
  {
    path: '/mainpage',
    name: 'mainpage',
    component: () => import('@/views/main_page.vue')
  },
  {
    path: '/songs',
    name: 'songs',
    component: () => import('@/views/songs.vue')
  },
  {
    path: '/top10',
    name: 'top10',
    component: () => import('@/views/top10.vue')
  },
  {
    path: '/firebase',
    name: 'firebase',
    component: () => import('@/views/firebase.js')
  },
  {
    path: '/songs_filtered',
    name: 'songs_filtered',
    component: () => import('@/views/songs_filtered.vue')
  },
  { path: '/', component: Songs },
  { path: '/songs_filtered', component: SongsFiltered },
  {
    path: '/post_event',
    name: 'post_event',
    component: () => import('@/views/post_event.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

