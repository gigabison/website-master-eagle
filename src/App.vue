<template>
  <div id="app">
    <header class="fixedHeader">
     <h1 class = "h1FixedHeader">EngLang</h1>
     <h2 class = "h2FixedHeader">All you’ve ever wanted to know about English &amp; more</h2>
    </header>
    <menu-system menuID='main'></menu-system>
    <router-view/>
    <br>
    <footer>
      <p>Nick is hot</p>
      <div v-if="userStore.firebaseUser">
        <button @click="logout2" class="item">Logout</button>
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
    logout1() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push({ name: "Login" });
      });
    },
    async logout2() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Index" });
        });
    },
    async account() {
      this.$router.push({ name: "Account" });
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Arsenal|Coming+Soon|Fredericka+the+Great|Oxygen");

.fixedHeader {
  background-color: rgb(170, 214, 141);
  padding: 5px;
  text-align: center;
  color: white;
}

.h1FixedHeader {
  font-family: "Oxygen", sans-serif;
  margin: 0px;
  padding: 0px;
  font-size: 35px;
  text-shadow: 4px 3px rgb(92, 92, 92);
}

.h2FixedHeader {
  font-family: "Oxygen", sans-serif;
  margin: 0px;
  padding: 0px;
  font-size: 30px;
  text-shadow: 3px 2px rgb(114, 114, 114);
}

footer {
  background-color: rgb(170, 214, 141);
  padding: 10px;
  text-align: center;
  color: white;
}
</style>
