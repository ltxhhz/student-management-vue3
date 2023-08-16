import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Info from './info.vue'
import Course from './course.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    alias: '/info',
    name: 'info',
    component: Info
  },
  {
    path: '/course',
    name: 'course',
    component: Course
  }
]

export const router = createRouter({
  routes,
  history: createWebHashHistory()
})
