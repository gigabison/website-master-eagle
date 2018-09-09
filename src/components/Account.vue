<template>
  <div v-if="userStore.firebaseUser">
    <h1>Account</h1>
    <h3>UID </h3>
    <h4>{{userStore.firebaseUser.uid}}</h4>
    <h3>displayName </h3>
    <h4>{{userStore.firebaseUser.displayName}}</h4>
    <h3>email</h3>
    <h4>{{userStore.firebaseUser.email}}</h4>
  </div>
</template>

<script>
import firebase from "vuex";
import { mapState } from "vuex";

export default {
  name: "Account",
  data() {
    return {};
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted() {
    const dict = {
      custom: {
        newPassword: {
          required: "The new password field is required."
        },
        confirmNewPassword: {
          required: "Please confirm your new password.",
          is: "Your passwords must match."
        }
      }
    };
    this.$validator.localize("en", dict);
  },

  methods: {}
};
</script>
