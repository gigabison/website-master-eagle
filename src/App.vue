<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app',

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },
  
  methods: {
    logout() {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>
