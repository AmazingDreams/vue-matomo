import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Page1 from '@/components/Page1'
import Page2 from '@/components/Page2'

Vue.use(Router)

export default new Router({
  base: '/something/',
  mode: 'history',
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
