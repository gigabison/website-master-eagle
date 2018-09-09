<template>
  <div>
   <section class="introSection">
        <ul class='editPageList'> 
          <li class='editPageItem'>
             <label for="newPage">Save as new page</label>
            <input id='newPage' type="checkbox" v-model="saveAsNewPage">
          </li>
          <li class='editPageItem'>
            <label for="category">Category</label>
            <input id='category' type='text' v-model="category">
          </li>
          <li class='editPageItem'>
            <button v-on:click="savePage">Save Page</button>
          </li>
          <li class='editPageItem'>
            <p>{{message}}</p>
          </li>
        </ul>
        <input type='text' class='title' v-model="title">
        <vue-editor v-model="content"></vue-editor>
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
import { VueEditor } from "vue2-editor";

export default {
  name: "EditPage",
  data() {
    return {
      loading: true,
      pageId: null,
      title: "Loading...",
      category: "Loading...",
      saveAsNewPage: false,
      message: "",
      content: "Loading..."
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
          this.content = snapshot.get("body");
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

      if (this.content == "") {
        this.message =
          "Error: you need to enter a non empty page content, silly :) ";
        return;
      }

      let db = firebase.firestore();
      let pageData = {
        title: this.title,
        category: this.category,
        body: this.content
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

input.title {
  font-family: "Oxygen", sans-serif;
  font-size: 25px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 0px;
  padding-right: 0px;
  border: 0px;
  margin-bottom: 0;
  background-color: rgb(170, 214, 141);
  width: 100%;
}

ul.editPageList {
  list-style: none;
  padding: 5px 10px;
  margin: 0;
}

li.editPageItem {
  display: inline-block;
  border: 3px;
  border-color: black;
}

p {
  font-family: "Oxygen", sans-serif;
  font-size: 18px;
  margin: 10px 10px;
  text-align: justify;
}
</style>

