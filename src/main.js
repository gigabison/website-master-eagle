import Vue from 'vue'
import App from './App'
import VeeValidate from 'vee-validate'
import router from './router'
import {
  store
} from './store'
import * as config from '../config'
import axios from 'axios'
import Raven from 'raven-js'
import firebase from 'firebase'

//custom components
import Page from './components/Page'
import Menu from './components/Menu'
import VueEditor from "vue2-editor";


import './assets/css/application.scss'

Vue.prototype.$config = config
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyDHJGvvSClzQDSU-e37uExidLDIiK0wEdY",
  authDomain: "website-eagle.firebaseapp.com",
  databaseURL: "https://website-eagle.firebaseio.com",
  projectId: "website-eagle",
  storageBucket: "website-eagle.appspot.com",
  messagingSenderId: "858225070468",
  appId: "1:858225070468:web:914cd335bfbeb9d9"
};

firebase.initializeApp(firebaseConfig)
Vue.component('page', Page)
Vue.component('menu-system', Menu)
Vue.use(VueEditor)
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
    components: {
      App
    },
    mounted() {
      this.$nextTick(() => {
        store.commit('SET_FIREBASE_USER', user)
      })
    }
  })
})
