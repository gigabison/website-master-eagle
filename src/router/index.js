import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

const Index = () =>
  import ('@/components/Index')
const Login = () =>
  import ('@/components/Auth/Login')
const PublicPage = () =>
  import ('@/components/PublicPage')
const EditPage = () =>
  import ('@/components/EditPage')
const Register = () =>
  import ('@/components/Auth/Register')
const Account = () =>
  import ('@/components/Account')
const Premium = () =>
  import ('@/components/Premium')
const EditMenu = () =>
  import ('@/components/EditMenu')

Vue.use(Router)

import * as config from '../../config'
import {
  store
} from '../store'
import {
  CognitoUserPool
} from 'amazon-cognito-identity-js'
import axios from 'axios'

const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/page/:id/edit',
      name: 'EditPage',
      component: EditPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/page/:id',
      name: 'PublicPage',
      component: PublicPage,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/editmenu',
      name: 'Edit Menu',
      component: EditMenu,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next({
      name: 'Login'
    })
    // } else if (!requiresAuth && currentUser) {
    //   next({
    //     name: 'Index'
    //   })
  } else {
    next()
  }
})

export default router
