<template>
  <div>
   <section class="introSection">
        <h1>{{title}}</h1>
        <div>{{body}}</div>
        </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import firebase from 'firebase'
import 'firebase/firestore'

export default {
  name: 'Page',
  props: ['pageID'],
  data () {
    return {
      loading: true,
      title: 'Loading...',
      body: 'Loading...'
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
        .doc(this.$props.pageID)
        .get()
        .then((snapshot) => {
          this.title = snapshot.get('title')
          this.body = snapshot.get('body')          
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
    font-family: 'Oxygen', sans-serif;
    font-size: 25px;  
    text-align: center;  
    padding: 10px;
    margin-bottom: 0;
    background-color: rgb(170, 214, 141);
}    

p {
    font-family: 'Oxygen', sans-serif;
    font-size: 18px; 
    margin: 10px 10px;
    text-align: justify;
}

</style>

