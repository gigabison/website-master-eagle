<template>
  <div>    
    <page pageId='McE98bnRIbPziXAdIljK'></page>
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
      page: []
    };
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted() {
    this.$nextTick(() => {});
  },

  methods: {}
};
</script>
