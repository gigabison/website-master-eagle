import Vue from 'vue'
import App from './App'
import VeeValidate from 'vee-validate'
import router from './router'
import { store } from './store'
import * as config from './config'
import axios from 'axios'
import Raven from 'raven-js'
import firebase from 'firebase'

import './assets/css/application.scss'

Vue.prototype.$config = config
Vue.config.productionTip = false

let firebaseConfig = {
  apiKey: config.FirebaseApiKey,
  authDomain: config.FirebaseAuthDomain,
  databaseURL: config.FirebaseDatabaseUrl,
  projectId: config.FirebaseProjectId,
  storageBucket: config.FirebaseStorageBucket,
  messagingSenderId: config.FirebaseMessageSenderId
}

firebase.initializeApp(firebaseConfig)

Vue.use(VeeValidate)

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (!error.response.status) {
    return Promise.reject(error)
  }

  if (error.response.status === 500) {
    Raven.captureException(`Internal Server Error`)
    Raven.showReportDialog()

    return Promise.reject(error)
  } else {
    return Promise.reject(error)
  }
})

let app

firebase.auth().onAuthStateChanged(function (user) {
  /* eslint-disable no-new */
  app = new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App },
    mounted () {
      this.$nextTick(() => {
        store.commit('SET_FIREBASE_USER', user)
      })
    }
  })
})
