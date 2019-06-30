<template>
  <div>
    <ul class="menuUl">
      <li  v-if="userStore.firebaseUser" class="menuLi menuActive">
          <button v-if= "editMode" class="menuText active" @click="editMenu">Save Menu</button>
          <button v-else class="menuText active" @click="editMenu">Edit Menu</button>
      </li>
      <li v-for="(menuPage, index) in menuPages" :key="index" class="menuLi menuActive">
          <ul  v-if="editMode" class="editMenuUl">
            <li>  
              <input id='title' type="text" v-model="menuPage.title">
            </li>
            <li>  
              <input id='link' type="text" v-model="menuPage.link">
            </li>
          </ul>
        <a v-else class="menuText active" :href="menuPage.link">{{menuPage.title}}</a>
      </li>
      
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";

export default {
  name: "Menu",
  props: ["menuId"],
  data() {
    return {
      loading: true,
      menuPages: [],
      editMode: false
    };
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted() {
    this.$nextTick(() => {
      let db = firebase.firestore();
      db
        .collection("menus")
        .doc(this.$props.menuId)
        .get()
        .then(snapshot => {
          let fbMenuPages = snapshot.get("pages");
          let newMenu = [];
          console.log(fbMenuPages)
          fbMenuPages.forEach(function(fbMenuPage) {

            let title = fbMenuPage["title"];
            let link = fbMenuPage["link"];
            newMenu.push({title,link});
          });
          this.menuPages = newMenu;
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
    editMenu() {
      this.editMode = !this.editMode;
      //this.$router.push({ name: "EditMenu" });
    }
  }
};
</script>

<style scoped>
.menuUl {
  text-align:center;
  list-style-type: none;
  overflow: hidden;
  border: 1px solid #e7e7e7;
  background-color: #FCCA46;
  margin: 0px;
  padding:0px;
}

.menuLi {
  text-align: center;
  display: inline-block;
}

.menuText {
  font-family: "Oxygen", sans-serif;
  display: inline-block;
  color: rgb(58, 58, 58);
  text-align: center;
  padding: 8px 8px;
  text-decoration: none;
}

.menuLi:hover {
  background-color: rgb(170, 214, 141);
}


.editMenuUl {
  list-style-type: none;
  padding: 5px;
  overflow: hidden;
  border: 1px solid #e7e7e7;
  background-color: #f3f3f3;
  display: inline-block;
}

</style>

