import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import List from '@/components/List'
import SignIn from '@/views/SignIn'
import SignUp from '@/views/SignUp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/list',
      name: 'List',
      component: List
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
    }
  ]
})
