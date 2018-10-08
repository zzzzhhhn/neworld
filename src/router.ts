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
        children: [
            {
                path: 'sudoku',
                meta: {
                    title: '数独'
                },
                component: () => import('./views/sudoku.vue'),
            },
            {
                path: 'tetris',
                meta: {
                    title: '俄罗斯方块（单机版）'
                },
                component: () => import('./views/tetris.vue'),
            },
            {
                path: 'orcish',
                meta: {
                    title: '兽人大战僵尸'
                },
                component: () => import('./views/orcish.vue'),
            },
            {
                path: 'monster',
                meta: {
                    title: '怪物农场'
                },
                component: () => import('./views/monster.vue'),
            },
        ]
    }
  ]
})
