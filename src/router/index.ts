import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(Router)

const routes: RouteConfig[] = [
  {
    name: 'login',
    path: '/login',
    component: () =>
      import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: { requireAuth: true },
    children: [
      {
        path: '/',
        redirect: 'home'
      },
      {
        name: 'home',
        path: '/home',
        component: () =>
          import(/* webpackChunkName: 'home' */ '@/views/home/index.vue')
      },
      {
        name: 'advert',
        path: '/advert',
        component: () =>
          import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue')
      },
      {
        name: 'advert-space',
        path: '/advert-space',
        component: () =>
          import(
            /* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue'
          )
      },
      {
        name: 'course',
        path: '/course',
        component: () =>
          import(/* webpackChunkName: 'course' */ '@/views/course/index.vue')
      },
      {
        name: 'menu',
        path: '/menu',
        component: () =>
          import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue')
      },
      {
        name: 'menu-create',
        path: '/menu/create',
        component: () =>
          import(
            /* webpackChunkName: 'menu-create' */ '@/views/menu/create.vue'
          )
      },
      {
        name: 'resource',
        path: '/resource',
        component: () =>
          import(
            /* webpackChunkName: 'resource' */ '@/views/resource/index.vue'
          )
      },
      {
        name: 'role',
        path: '/role',
        component: () =>
          import(/* webpackChunkName: 'role' */ '@/views/role/index.vue')
      },
      {
        name: 'user',
        path: '/user',
        component: () =>
          import(/* webpackChunkName: 'user' */ '@/views/user/index.vue')
      }
    ]
  },
  {
    name: '404',
    path: '*',
    component: () =>
      import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth) && !store.state.user) {
    next({ name: 'login', query: { redirect: from.fullPath } })
  }
  next()
})

export default router