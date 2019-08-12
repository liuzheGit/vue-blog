import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser(state, user){
      state.user = user;
      console.log('state------------------')
      console.log(state.user.username)
    }

  },
  actions: {

  }
})
