import firebase from 'firebase'

const state = {
  firebaseUser: null
}

const getters = {
  firebaseUser: () => {
    return state.firebaseUser
  }
}

const actions = {
  login ({ commit, rootState, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password).then(
        function (user) {
          console.log(user)
          commit('SET_FIREBASE_USER', user)
          resolve(user)
        },
        function (err) {
          reject(err)
        }
      )
    })
  },

  register ({ commit, rootState, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
        function (user) {
          resolve(user)
        },
        function (err) {
          reject(err)
        }
      )
    })
  },

  logout: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(() => {
        resolve()
      })
    })
  }
}

const mutations = {
  SET_FIREBASE_USER (state, firebaseUser) {
    state.firebaseUser = firebaseUser
  },

  CLEAR_STATE (state) {
    state.firebaseUser = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
