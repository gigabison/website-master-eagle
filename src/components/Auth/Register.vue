<template>
  <div>
    Register component
    <form @submit.prevent="register" @keydown="error=null">

      <transition name="fade" mode="out-in">
        <div class="ui red message" v-if="error">
          {{ error }}
        </div>
      </transition>

      <div>
        <label for="email">Email</label>
        <input autofocus="autofocus" name="email" v-validate="{ required: true, email: true }" v-model="email">
        <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
      </div>

      <div>
        <label for="name">Name</label>
        <input autofocus="autofocus" name="name" v-validate="{ required: true }" v-model="attributes.name">
        <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
      </div>

      <div>
        <label for="password">Password</label>
        <input name="password" v-validate="{ required: true }" v-model="password" type="new-password">
        <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
      </div>

      <div>
        <label for="passwordConfirmation">Password Confirmation</label>
        <input name="passwordConfirmation" v-validate="{ is: password, required: true }" v-model="passwordConfirmation" type="new-password">
        <span v-show="errors.has('passwordConfirmation')" class="help is-danger">{{ errors.first('passwordConfirmation') }}</span>
      </div>

      <button v-bind:class="{ loading: loading }" v-bind:disabled="loading" class="ui blue button">Register</button>
      <br>
      <router-link :to="{ name: 'Login'}">Login</router-link>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',

  data () {
    return {
      loading: false,
      error: null,
      email: null,
      password: null,
      passwordConfirmation: null,
      attributes: {
        name: null
      }
    }
  },

  mounted () {
    const dict = {
      custom: {
        passwordConfirmation: {
          is: 'Your passwords must match.'
        }
      }
    }
    this.$validator.localize('en', dict)
  },

  methods: {
    register (event) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch('register', {
            email: this.email,
            password: this.password,
            attributes: this.attributes
          })
          .then(() => {
            this.$router.push({ name: 'Index' })
          })
          .catch((err) => {
            this.loading = false
            this.error = err.message
          })
        }
      })
    }
  }
}
</script>
