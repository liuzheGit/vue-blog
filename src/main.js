import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


//  api
import api from './api'
localStorage.setItem('debug', 'leancloud*')

// 进度条
import VueProgressBar from 'vue-progressbar'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);


const VueProgressBaroptions = {
  color: '#bffaf3',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, VueProgressBaroptions)


const user = api.SDK.User.current();
window.user = user;
if(user) {
  store.commit('setUser', user)
}

Vue.mixin({
  beforeCreate(){
    if(api && !this.$api){
      this.$api = api
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
