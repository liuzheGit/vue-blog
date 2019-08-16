import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import ArticleList from '@/components/List'
import SignIn from '@/views/SignIn'
import SignUp from '@/views/SignUp'
import ArticleCreate from '@/views/article/create'
import ArticleShow from '@/views/article/index'
import ArticleEdit from '@/views/article/edit'
import User from '@/views/user/index'
import Followee from '@/views/user/myFollowee'
import Follower from '@/views/user/myFollower'
import Message from '@/views/user/message'
import Friend from '@/views/user/friend'

Vue.use(Router)

export default new Router({
  // mode: 'history',
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
    },
    {
      path: '/article/:id',
      name: 'ArticleShow',
      component: ArticleShow
    },
    {
      path: '/article/:id/edit',
      name: 'ArticleEdit',
      component: ArticleEdit,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/user/:id',
      name: 'User',
      component: User
    },
    {
      path: '/followee',
      name: 'Followee',
      component: Followee,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/follower',
      name: 'Follower',
      component: Follower,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/message',
      name: 'Message',
      component: Message,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/friend',
      name: 'Friend',
      component: Friend,
      meta: {
        needLogin: true
      }
    }
  ]
})
