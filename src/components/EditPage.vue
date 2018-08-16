<template>
  <div>
   <section class="introSection">
        <h1> Edit Page </h1>
        <h2>Title</h2>
        <input type='text' v-model="title">
        <h2>Category</h2>
        <input type='text' v-model="category">
        <h2>Body</h2>
        <textarea v-model="body" cols="40" rows="5"></textarea>
        <p>{{message}}</p>
        <label><input type="checkbox" v-model="saveAsNewPage"> Save as new page </label>
        <br>
        <button v-on:click="savePage">Save Page</button>
  </section>
  <br>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";

export default {
  name: "EditPage",
  data() {
    return {
      loading: true,
      pageId: null,
      title: "Loading...",
      body: "Loading...",
      category: "Loading...",
      saveAsNewPage: false,
      message: ""
    };
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.pageId = this.$route.params.id;

      if (this.pageId == null) {
        message = "page not found!";
        return;
      }

      let db = firebase.firestore();
      db
        .collection("pages")
        .doc(this.pageId)
        .get()
        .then(snapshot => {
          this.title = snapshot.get("title");
          this.body = snapshot.get("body");
          this.category = snapshot.get("category");
        })
        .then(() => {
          this.loading = false;
        })
        .catch(err => {
          console.error(err.message);
        });
    });
  },

  methods: {
    savePage: function() {
      if (this.title == "") {
        this.message =
          "Error: you need to enter a non empty page title, silly :) ";
        return;
      }

      if (this.body == "") {
        this.message =
          "Error: you need to enter a non empty page body, silly :) ";
        return;
      }

      let db = firebase.firestore();
      let pageData = {
        title: this.title,
        category: this.category,
        body: this.body
      };
      let promise = null;
      if (this.saveAsNewPage) {
        promise = db.collection("pages").add(pageData);
      } else {
        promise = db
          .collection("pages")
          .doc(this.pageId)
          .set(pageData);
      }

      promise
        .then(snapshot => {
          console.log(snapshot);
          if (this.saveAsNewPage) {
            this.message = "New page created!";
            this.$router.push({
              name: "EditPage",
              params: { id: snapshot.id }
            });
          } else {
            this.message = "Page successfully saved!";
            this.$router.push({
              name: "EditPage",
              params: { id: this.pageId }
            });
          }
        })
        .catch(error => {
          this.message = `Error writing document: ${error}`;
          console.error("Error writing document: ", error);
        });
    }
  }
};
</script>

<style scoped>
.introSection {
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 800px;
  background-color: #f3f3f3;
}

h1 {
  font-family: "Oxygen", sans-serif;
  font-size: 25px;
  text-align: center;
  padding: 10px;
  margin-bottom: 0;
  background-color: rgb(230, 23, 23);
}

p {
  font-family: "Oxygen", sans-serif;
  font-size: 18px;
  margin: 10px 10px;
  text-align: justify;
}
</style>

