<template>
  <div>
    <page v-if='pageId' :pageId='pageId'></page>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";
import Router from "vue-router";

export default {
  name: "PublicPage",
  props: [],
  data() {
    return {
      loading: true,
      title: "Loading...",
      body: "Loading...",
      pageId: null
    };
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted() {
    this.$nextTick(function() {});
    this.pageId = this.$route.params.id;
  },

  methods: {}
};
</script>

<style scoped>
</style>

