import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue(); // Global event bus
Vue.prototype.$axios = axios;

new Vue({
  render: h => h(App),
}).$mount('#app')
