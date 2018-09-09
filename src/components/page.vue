<template>
  <div>
   
   <section class="introSection">
      <div v-if="userStore.firebaseUser">
         <ul class='editPageList'> 
          <li class='editPageItem'>
            <button @click="editPage">Edit Page</button>
          </li>
        </ul>
      </div>
      
      <h1>{{title}}</h1>
      <div class="ql-editor">
        <div v-html="body"></div>
      </div>
      
  </section>
  
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";
import { VueEditor, Quill } from "vue2-editor";

export default {
  name: "Page",
  props: ["pageId", "samplePage"],
  data() {
    return {
      loading: true,
      title: "Loading...",
      body: "Loading..."
    };
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted() {
    this.$nextTick(() => {
      let id = this.$props.pageId;
      if (id != null) {
        this.loadPageFromId(id);
      } else {
        let data = this.$props.samplePage;
        if (data == null) {
          data = {
            title: "Page not found",
            body: "Page not found"
          };
          this.loadPageFromData(data);
        }
      }
    });
  },

  methods: {
    loadPageFromId(id) {
      let db = firebase.firestore();
      db
        .collection("pages")
        .doc(id)
        .get()
        .then(snapshot => {
          this.title = snapshot.get("title");
          this.body = snapshot.get("body");
        })
        .then(() => {
          this.loading = false;
        })
        .catch(err => {
          console.error(err.message);
        });
    },
    loadPageFromData(data) {
      this.title = data.title;
      this.body = data.body;
    },
    editPage() {
      this.$router.push({ name: "EditPage", params: { id: this.pageId } });
    }
  }
};
</script>

<style>
.introSection {
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 800px;
  background-color: #f3f3f3;
}

.introSection h1 {
  font-family: "Oxygen", sans-serif;
  font-size: 25px;
  text-align: center;
  padding: 10px;
  margin-bottom: 0px;
  margin-top: 0px;
  background-color: rgb(170, 214, 141);
}

.introSection ul.editPageList {
  list-style: none;
  padding: 5px 10px;
  margin: 0;
}

.introSection li.editPageItem {
  display: inline-block;
  border: 3px;
  border-color: black;
}

.introSection p {
  font-family: "Oxygen", sans-serif;
  font-size: 18px;
  margin: 10px 10px;
  text-align: justify;
}
</style>

