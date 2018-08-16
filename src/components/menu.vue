<template>
  <div>
    <ul class="menuUl">
      <li v-for="(menuPage, index) in menuPages" :key="index" class="menuLi menuActive"><a class="menuText active" :href="menuPage.link">{{menuPage.menuItem}}</a></li>

    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import firebase from 'firebase'
import 'firebase/firestore'

export default {
  name: 'Menu',
  props: ['menuID'],
  data () {
    return {
      loading: true,
      menuPages: []
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
      db.collection('menus')
        .doc(this.$props.menuID)
        .get()
        .then((snapshot) => {
          let fbMenuPages = snapshot.get('pages')
          let newMenu = []
          fbMenuPages.forEach(function(fbMenuPage){
            let menuItem = fbMenuPage['menu-item']
            let link = fbMenuPage['page-link']
            let menuPage = {
              menuItem: menuItem,
              link: link
            }
            newMenu.push(menuPage)
          })
          this.menuPages = newMenu
          console.log(documentData)
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
    
  }
}
</script>

<style scoped>
.menuUl {
    list-style-type: none;
    padding: 15px;
    overflow: hidden;
    border: 1px solid #e7e7e7;
    background-color: #f3f3f3;
}

.menuLi{
    text-align: center;
    display: inline-block;
}

.menuText {
    font-family: 'Oxygen', sans-serif;
    display: inline-block;
    color: rgb(58, 58, 58);
    text-align: center;
    padding: 8px 8px;
    text-decoration: none;
}

.menuLi:hover {
    background-color:  rgb(170, 214, 141);
}
</style>

