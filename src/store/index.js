import Vue from 'vue'
import Vuex from 'vuex'

import userStore from './modules/user'
import * as config from '../../config'

Vue.prototype.$config = config
Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    userStore
  },
  state: {
    config
  },
  root: true
})
