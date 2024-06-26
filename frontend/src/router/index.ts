import ItemView from '@/views/ItemView.vue'
import LabelView from '@/views/LabelView.vue'
import UploadView from '@/views/UploadView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/upload'
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView
    },
    {
      path: '/label',
      name: 'label',
      component: LabelView
    },
    {
      path: '/item',
      name: 'item',
      component: ItemView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
