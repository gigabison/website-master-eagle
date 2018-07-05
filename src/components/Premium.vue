<template>
  <div v-if="userStore.cognitoUser">
    <h1>Premium</h1>
    <div v-for="plan in plans" :key="plan.id">
      {{ plan.name }}
      <br>
      ${{ plan.amount / 100 }}
      <br>
      <button @click="changePlan(plan)">Change Plan</button>
    </div>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script src="https://checkout.stripe.com/checkout.js"></script>
<script>
import AWS from 'aws-sdk'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'Premium',
  data () {
    return {
      plans: []
    }
  },

  computed: {
    ...mapState({
      userStore: state => state.userStore
    })
  },

  mounted () {
    this.retrievePlans()
  },

  methods: {
    retrievePlans: function() {
      axios.get('/premium/plans')
        .then((plans) => {
          plans.data.forEach((plan) => {
            this.plans.push(plan)
          })
        })
    },

    changePlan: function(plan) {
      this.$checkout.open({
        name: 'MovieSurf',
        description: `Premium - ${plan.name}`,
        currency: 'USD',
        amount: plan.amount,
        email: this.userStore.cognitoUserAttributes.email,
        token (token) {
          console.log(token)
          axios.post('/premium/charge', { plan, token })
            .then((result) => {
              console.log(result)
            }) 
        } 
      })
    },
  }
}
</script>