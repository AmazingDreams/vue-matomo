import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Page1 from '@/components/Page1'
import Page2 from '@/components/Page2'


const base = '/something/';
const routerHistory = createWebHistory(base)

export default createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/page-1',
      name: 'Page1',
      component: Page1,
      meta: {
        title: 'Test Page 1 Title'
      }
    },
    {
      path: '/page-2',
      name: 'Page2',
      component: Page2,
      meta: {
        analyticsIgnore: true
      }
    }
  ]
})
