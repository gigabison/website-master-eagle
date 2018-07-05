import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js'
import AWS from 'aws-sdk'
import Raven from 'raven-js'

const state = {
  cognitoUser: null,
  cognitoUserAttributes: null,
  cognitoUserGroups: null
}

const getters = {
  cognitoUser: () => {
    return state.cognitoUser
  }
}

const actions = {
  login ({ commit, rootState, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      const userPool = new CognitoUserPool({
        UserPoolId: rootState.config.UserPoolId,
        ClientId: rootState.config.ClientId
      })

      const authenticationDetails = new AuthenticationDetails({
        Username: payload.username,
        Password: payload.password
      })

      const cognitoUser = new CognitoUser({
        Username: payload.username,
        Pool: userPool
      })

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          let session = cognitoUser.getSession((err, session) => {
            if (err) {
              return console.log(err)
            }

            return session
          })

          dispatch('setupAwsSdk', session)
          dispatch('loadCognitoUserAttributes', cognitoUser)
          dispatch('loadCognitoUserGroups', cognitoUser)
          commit('SET_COGNITO_USER', cognitoUser)
          resolve()
        },

        onFailure: (err) => {
          reject(err)
        }
      })
    })
  },

  register ({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      let attributes = []

      Object.entries(payload.attributes).forEach(([key, val]) => {
        const attribute = new CognitoUserAttribute({
          Name: key,
          Value: val
        })

        attributes.push(attribute)
      })

      const userPool = new CognitoUserPool({
        UserPoolId: rootState.config.UserPoolId,
        ClientId: rootState.config.ClientId
      })

      userPool.signUp(payload.username, payload.password, attributes, null, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  },

  logout: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      state.cognitoUser.signOut()
      commit('CLEAR_STATE')
      resolve()
    })
  },

  setupAwsSdk: ({ commit, rootState }, payload) => {
    return new Promise((resolve, reject) => {
      AWS.config.region = rootState.config.Region

      AWS.config.apiVersions = {
        lambda: '2015-03-31'
      }

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: rootState.config.IdentityPoolId,
        Logins: {
          [rootState.config.LoginUrl]: payload.getIdToken().getJwtToken()
        }
      })

      AWS.config.credentials.refresh((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  },

  loadCognitoUserAttributes: ({ commit }, cognitoUser) => {
    return new Promise((resolve, reject) => {
      cognitoUser.getUserAttributes((err, result) => {
        if (err) return reject(err)

        let attributes = {}

        Object.entries(result).forEach(([key, val]) => {
          attributes[val.Name] = val.Value
        })

        Raven.setUserContext({
          email: attributes.email,
          name: attributes.name
        })

        commit('SET_COGNITO_USER_ATTRIBUTES', attributes)
        resolve()
      })
    })
  },

  loadCognitoUserGroups: ({ commit }, cognitoUser) => {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },

  updateCognitoUserAttributes: ({ commit, state }) => {
    let attributes = state.cognitoUserAttributes
    delete attributes.sub

    let updatedAttributes = []

    Object.entries(attributes).forEach(([key, val]) => {
      updatedAttributes.push({
        Name: key,
        Value: val
      })
    })

    return new Promise((resolve, reject) => {
      state.cognitoUser.updateAttributes(updatedAttributes, (err, result) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  },

  changePassword: ({ commit, state }, payload) => {
    return new Promise((resolve, reject) => {
      state.cognitoUser.changePassword(payload.password, payload.newPassword, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}

const mutations = {
  SET_COGNITO_USER (state, cognitoUser) {
    state.cognitoUser = cognitoUser
  },

  SET_COGNITO_USER_ATTRIBUTES (state, attributes) {
    state.cognitoUserAttributes = attributes
  },

  CLEAR_STATE (state) {
    Raven.setUserContext({})
    state.cognitoUser = null
    state.cognitoUserGroups = null
    state.cognitoUserAttributes = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
