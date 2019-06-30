<template>
  <div id="app">
    <header class="fixedHeader">
     <h1 class = "h1FixedHeader">Gigabison</h1>
     <h2 class = "h2FixedHeader">We make games</h2>
    </header>
    <menu-system menuId='main'></menu-system>
    <router-view/>
    <br>
    <footer>
      <h2 class = "h2FixedHeader">nick@gigabison.com</h2>
      <div v-if="userStore.firebaseUser">
        <button @click="logout" class="item">Logout</button>
        <button @click="account" class="item">Account</button>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";

export default {
  name: "app",

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  methods: {
    async logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Index" });
        });
    },
    async account() {
      this.$router.push({ name: "Account" });
    },
    async login() {
      this.$router.push({ name: "Login" });
    }

  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Arsenal|Coming+Soon|Fredericka+the+Great|Oxygen");
@import "assets/css/quill.bubble.css";

body{
  margin: 0px;
}

.fixedHeader {
  background-color: white;
  padding: 5px;
  text-align: center;
  color: white;
}

.h1FixedHeader {
  font-family: "Nunito", sans-serif;
  margin: 0px;
  padding: 0px;
  font-size: 35px;
  color:  #233D4D;
}

.h2FixedHeader {
  font-family: "Nunito", sans-serif;
  margin: 0px;
  padding: 0px;
  font-size: 20px;
  color:  #233D4D;
}

footer {
  background-color: #FCCA46;
  padding: 10px;
  text-align: center;
  color: white;
}
</style>
