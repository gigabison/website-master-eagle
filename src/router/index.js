import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

const Index = () => import('@/components/Index')
const Login = () => import('@/components/Auth/Login')
const Register = () => import('@/components/Auth/Register')
const Account = () => import('@/components/Account')
const Premium = () => import('@/components/Premium')

Vue.use(Router)

import * as config from '../../config'
import { store } from '../store'
import { CognitoUserPool } from 'amazon-cognito-identity-js'
import axios from 'axios'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        requiresAuth: true
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
      path: '/account',
      name: 'Account',
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/premium',
      name: 'Premium',
      component: Premium,
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
  } else if (!requiresAuth && currentUser) {
    next({
      name: 'Index'
    })
  } else {
    next()
  }
})

export default router
