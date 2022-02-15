import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import config from './config'


Vue.config.productionTip = false

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io(config.address),
  })
)

new Vue({
  router,
  store,
  data: config,
  render: h => h(App)
}).$mount('#app')
