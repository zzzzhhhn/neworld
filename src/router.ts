import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home/',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      path: '/home/',
      name: 'home',
        meta: {
            title: '左拉大世界欢迎您！'
        },
        component: () => import(/* webpackChunkName: "home" */'./views/index.vue'),
    }
  ]
})
