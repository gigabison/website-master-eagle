<template>
  <div v-if="userStore.firebaseUser">    
    <ul>
      <li v-for="(page, index) in pages" :key='index'>{{page.title}}
        <input type="checkbox" v-model="page.includeInMenu">
        <ul v-if='page.includeInMenu'>
          <li v-for="(subPage, index) in page.subPages" :key='index'>{{subPage.title}} 
             <input type="checkbox" v-model="subPage.includeInMenu">
             <ul v-if='subPage.includeInMenu'>
              <li v-for="(subSubPage, index) in subPage.subPages" :key='index'>{{subSubPage.title}} 
                <input type="checkbox" v-model="subSubPage.includeInMenu">
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <p>Input the name of your menu. If you enter 'main' it will override the current main menu</p>
    <input type="text" v-model="menuName">
    <button v-on:click="saveMainMenu">Save Main Menu</button>
    <p>{{message}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";

export default {
  name: "Index",
  data() {
    return {
      loading: true,
      pages: [],
      message: "",
      menuName: "main"
    };
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.loadPagesWithCategory("", this.pages);
    });
  },

  methods: {
    loadPagesWithCategory: function(category, pages) {
      let db = firebase.firestore();
      let pagesQuery = db.collection("pages").where("category", "==", category);
      pagesQuery.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let page = {
            id: doc.id,
            title: doc.data().title,
            subPages: [],
            includeInMenu: false
          };
          if (page.title != category) {
            //This if statement stops an infinite loop of recursive calls if you make a page title it's own category
            //This if case will always be false actually, but I'm leaving it because I dont f with recursion
            pages.push(page);
            this.loadPagesWithCategory(page.title, page.subPages);
          }
        });
      });
    },
    saveMainMenu: function() {
      if (this.menuName == "") {
        this.message = "Error: you need to enter a menu name, silly:) ";
        return;
      }

      let db = firebase.firestore();
      let menuPages = [];
      this.recursiveAddPages(this.pages, menuPages);
      db
        .collection("menus")
        .doc(this.menuName)
        .set({
          pages: menuPages
        })
        .then(() => {
          this.message = "Menu successfully saved!";
        })
        .catch(error => {
          this.message = `Error writing document: ${error}`;
          console.error("Error writing document: ", error);
        });
    },
    recursiveAddPages: function(pagesToAdd, listToAddPagesTo) {
      pagesToAdd.forEach(page => {
        if (page.includeInMenu) {
          let pageLink = `/page/${page.id}`;
          let subPages = [];
          this.recursiveAddPages(page.subPages, subPages);
          let menuPage = {
            "menu-item": page.title,
            "page-link": pageLink,
            "sub-pages": subPages
          };
          listToAddPagesTo.push(menuPage);
        }
      });
    }
  }
};
</script>
