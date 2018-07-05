<template>
  <div>
    Login component
    <form @submit.prevent="login" @keydown="error=null">

      <transition name="fade" mode="out-in">
        <div class="ui red message" v-if="error">
          {{ error }}
        </div>
      </transition>

      <div>
        <label for="email">Email</label>
        <input autofocus="autofocus" name="email" type="text" v-validate="{ required: true, email: true }" v-model="email">
        <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
      </div>

      <div>
        <label for="password">Password</label>
        <input name="password" type="password" autocomplete="current-password" v-validate="{ required: true }" v-model="password">
        <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
      </div>

      <button v-bind:class="{ loading: loading }" v-bind:disabled="loading" class="ui blue button">{{ loginButtonText }}</button>
      <br>
      <router-link :to="{ name: 'Register'}">Need an account?</router-link>
    </form>
  </div>
</template>

<script>
import async from 'async'
import firebase from 'firebase'
import axios from 'axios'

export default {
  name: 'Login',

  data () {
    return {
      loading: false,
      error: null,
      email: '',
      password: '',
      loginButtonText: 'Login'
    }
  },

  methods: {
    async login (event) {
      var vm = this

      vm.loading = true
      vm.loginButtonText = 'Loading...'

      this.$validator.validateAll().then(function (result) {
        if (result) {
          firebase.auth().signInWithEmailAndPassword(vm.email, vm.password)
            .then(function (user) {
              vm.$router.replace({ name: 'Index' })
            })
            .catch(function (err) {
              vm.loading = false
              vm.loginButtonText = 'Login'
              vm.error = err.message
            })
        }
      })
    }
  }
}
</script>
