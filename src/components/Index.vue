<template>
  <div v-if="userStore.firebaseUser">
    <h1 v-if="page">{{page.title}}</h1>
    <p>
      Hello! The last time we saw you sign in was at: {{ userStore.firebaseUser.metadata.lastSignInTime }}
    </p>
    <!---Loading: {{ loading }}-->
    {{ page.body }}
    <button @click="logout" class="item">Logout</button>
    <br>
    <router-link :to="{ name: 'Account' }">Account</router-link>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import firebase from 'firebase'
import 'firebase/firestore'

export default {
  name: 'Index',
  data () {
    return {
      loading: true,
      page: null
    }
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted () {
    this.$nextTick(() => {
      let db = firebase.firestore()
      db.collection('pages')
        .doc('IZtkRWHoYInupmQQ9Y2S')
        .get()
        .then((snapshot) => {
          this.page = snapshot.data()
        })
        .then(() => {
          this.loading = false
        })
        .catch((err) => {
          console.error(err.message)
        })
    })
  },

  methods: {
    async logout () {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>
