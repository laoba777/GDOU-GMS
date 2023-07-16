import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import "./assets/css/global.css"

import axios from './axios'
import global from './globalFun'

Vue.prototype.$axios = axios // 将axios挂载到Vue实例中的$axios上，在项目中的任何位置通过this.$axios使用
Vue.config.productionTip = false

// require("./mock.js")

Vue.use(Element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Create a new Vue instance as an event bus
Vue.prototype.$bus = new Vue();
