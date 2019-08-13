import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import ArticleList from '@/components/List'
import SignIn from '@/views/SignIn'
import SignUp from '@/views/SignUp'
import ArticleCreate from '@/views/article/create'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/article',
      name: 'ArticleList',
      component: ArticleList
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/article/create',
      name: 'ArticleCreate',
      component: ArticleCreate,
      meta: {
        needLogin: true
      }
    }
  ]
})
