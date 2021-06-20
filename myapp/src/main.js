import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import VueResource from "vue-resource"
const echarts = require('echarts');
Vue.prototype.$echarts = echarts

Vue.prototype.HOST = 'http://localhost:4000'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
Vue.use(VueResource);

Vue.prototype.$axios  = Axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
